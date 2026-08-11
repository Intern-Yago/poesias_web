import { prisma } from "../../../lib/prisma"
import { checkIsAdmin } from "../../../lib/admin"
import { getToken } from "next-auth/jwt"

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create new report
    try {
      const { poetryId, motivo } = req.body || {}
      if (!poetryId || !motivo || !motivo.trim()) {
        return res.status(400).json({ error: "ID da poesia e motivo da denúncia são obrigatórios." })
      }

      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro" })
      const reporterName = token?.name || token?.email || req.body?.autor || "Anônimo"

      // Check if poetry exists
      const poetry = await prisma.poetrys.findUnique({
        where: { id: String(poetryId) }
      })
      if (!poetry) {
        return res.status(404).json({ error: "Poesia não encontrada." })
      }

      const report = await prisma.report.create({
        data: {
          poetryId: String(poetryId),
          motivo: motivo.trim().slice(0, 500),
          autor: String(reporterName).slice(0, 100),
          status: "PENDENTE"
        }
      })

      return res.status(201).json({ message: "Denúncia enviada com sucesso! A equipe de moderação irá analisar.", report })
    } catch (error) {
      console.error("Erro ao criar denúncia:", error)
      return res.status(500).json({ error: "Erro interno ao registrar a denúncia." })
    }
  }

  // Protected Admin Routes below
  const isAdmin = await checkIsAdmin(req)
  if (!isAdmin) {
    return res.status(403).json({ error: "Acesso restrito a administradores." })
  }

  if (req.method === 'GET') {
    try {
      const { status } = req.query
      const whereCondition = status ? { status: String(status) } : {}

      const reports = await prisma.report.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        include: {
          poetry: {
            select: {
              id: true,
              titulo: true,
              autor: true,
              mensagem: true,
              createdAt: true
            }
          }
        }
      })

      return res.status(200).json({ reports })
    } catch (error) {
      console.error("Erro ao listar denúncias:", error)
      return res.status(500).json({ error: "Erro ao carregar denúncias." })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, status } = req.body || {}
      if (!id || !status) {
        return res.status(400).json({ error: "ID e status são obrigatórios." })
      }

      const updatedReport = await prisma.report.update({
        where: { id: String(id) },
        data: { status: String(status) }
      })

      return res.status(200).json({ message: "Status da denúncia atualizado com sucesso!", report: updatedReport })
    } catch (error) {
      console.error("Erro ao atualizar denúncia:", error)
      return res.status(500).json({ error: "Erro ao atualizar a denúncia." })
    }
  }

  res.setHeader('Allow', ['POST', 'GET', 'PATCH'])
  return res.status(405).json({ error: `Método ${req.method} não permitido` })
}
