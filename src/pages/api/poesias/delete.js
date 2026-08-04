import { prisma } from "../../../lib/prisma"
import { getToken } from "next-auth/jwt"

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    res.setHeader('Allow', ['DELETE', 'POST'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro" })
    const legacyToken = req.cookies?.token || req.headers?.cookie

    if (!token && !legacyToken) {
      return res.status(401).json({ error: "Acesso não autorizado. Faça login para excluir uma poesia." })
    }

    const { id } = req.body || req.query || {}

    if (!id) {
      return res.status(400).json({ error: "ID da poesia não fornecido." })
    }

    // Find the poetry to verify existence
    const poetry = await prisma.poetrys.findUnique({
      where: { id: String(id) }
    })

    if (!poetry) {
      return res.status(404).json({ error: "Poesia não encontrada." })
    }

    // Determine current user name / email
    const currentUser = token?.name || token?.email?.split('@')[0] || req.cookies?.user_name || ''

    // Permission check: allow author to delete (or if author matches case-insensitive)
    const isAuthor = currentUser && poetry.autor && 
      (poetry.autor.trim().toLowerCase() === currentUser.trim().toLowerCase() ||
       poetry.autor.trim().toLowerCase() === token?.email?.toLowerCase())

    // If currentUser is set, enforce ownership
    if (!isAuthor && currentUser) {
      return res.status(403).json({ error: "Você só tem permissão para excluir as suas próprias poesias." })
    }

    // Delete the poetry
    await prisma.poetrys.delete({
      where: { id: String(id) }
    })

    return res.status(200).json({ message: "Poesia removida com sucesso!" })
  } catch (error) {
    console.error("Erro ao deletar poesia:", error)
    return res.status(500).json({ error: error.message || "Erro interno ao deletar a poesia." })
  }
}
