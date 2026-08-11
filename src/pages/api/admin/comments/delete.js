import { prisma } from "../../../../lib/prisma"
import { checkIsAdmin } from "../../../../lib/admin"

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    res.setHeader('Allow', ['DELETE', 'POST'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  const isAdmin = await checkIsAdmin(req)
  if (!isAdmin) {
    return res.status(403).json({ error: "Acesso restrito a administradores." })
  }

  try {
    const { id } = req.body || req.query || {}
    if (!id) {
      return res.status(400).json({ error: "ID do comentário é obrigatório." })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: String(id) }
    })

    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado." })
    }

    await prisma.comment.delete({
      where: { id: String(id) }
    })

    return res.status(200).json({ message: "Comentário removido com sucesso!" })
  } catch (error) {
    console.error("Erro ao deletar comentário:", error)
    return res.status(500).json({ error: "Erro interno ao excluir o comentário." })
  }
}
