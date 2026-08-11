import { prisma } from "../../../../lib/prisma"
import { checkIsAdmin } from "../../../../lib/admin"

export default async function handler(req, res) {
  const isAdmin = await checkIsAdmin(req)
  if (!isAdmin) {
    return res.status(403).json({ error: "Acesso restrito a administradores." })
  }

  // DELETE User
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body || {}
      if (!id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório." })
      }

      await prisma.user.delete({
        where: { id: String(id) }
      })

      return res.status(200).json({ message: "Usuário excluído com sucesso!" })
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      return res.status(500).json({ error: "Erro ao excluir usuário." })
    }
  }

  // PATCH Reset Password
  if (req.method === 'PATCH') {
    try {
      const { id, newPassword } = req.body || {}
      if (!id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório." })
      }

      const tempPass = newPassword || `suporte${Math.floor(1000 + Math.random() * 9000)}`

      const updated = await prisma.user.update({
        where: { id: String(id) },
        data: { password: tempPass }
      })

      return res.status(200).json({
        message: "Senha resetada com sucesso!",
        newPassword: tempPass,
        user: updated
      })
    } catch (error) {
      console.error("Erro ao resetar senha do usuário:", error)
      return res.status(500).json({ error: "Erro ao resetar senha." })
    }
  }

  res.setHeader('Allow', ['DELETE', 'PATCH'])
  return res.status(405).json({ error: `Método ${req.method} não permitido` })
}
