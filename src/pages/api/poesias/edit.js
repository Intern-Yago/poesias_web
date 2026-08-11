import { prisma } from "../../../lib/prisma"
import { getToken } from "next-auth/jwt"
import { checkIsAdmin } from "../../../lib/admin"

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'POST') {
    res.setHeader('Allow', ['PUT', 'POST'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro" })
    const legacyToken = req.cookies?.token
    const isAdmin = await checkIsAdmin(req)

    const { id, titulo, mensagem, isPrivate } = req.body || {}

    if (!id) {
      return res.status(400).json({ error: "ID da poesia é obrigatório." })
    }

    const poetry = await prisma.poetrys.findUnique({
      where: { id: String(id) }
    })

    if (!poetry) {
      return res.status(404).json({ error: "Poesia não encontrada." })
    }

    // Permission check: must be author or admin
    const sessionUser = token?.name || token?.email?.split('@')[0] || legacyToken
    const isAuthor = Boolean(
      sessionUser &&
      poetry.autor &&
      sessionUser.trim().toLowerCase() === poetry.autor.trim().toLowerCase()
    )

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: "Você só tem permissão para editar suas próprias poesias." })
    }

    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length === 0) {
      return res.status(400).json({ error: "O texto da poesia não pode estar em branco." })
    }

    if (mensagem.trim().length > 3000) {
      return res.status(400).json({ error: "A poesia deve ter no máximo 3000 caracteres." })
    }

    const cleanTitulo = titulo && typeof titulo === 'string' && titulo.trim() ? titulo.trim().slice(0, 150) : null
    const cleanMensagem = mensagem.trim()

    const updated = await prisma.poetrys.update({
      where: { id: String(id) },
      data: {
        titulo: cleanTitulo,
        mensagem: cleanMensagem,
        isPrivate: Boolean(isPrivate)
      }
    })

    return res.status(200).json({
      message: "Poesia atualizada com sucesso!",
      poetry: {
        id: updated.id,
        titulo: updated.titulo,
        autor: updated.autor,
        mensagem: updated.mensagem,
        likes: updated.likes,
        isPrivate: updated.isPrivate,
        date: updated.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error("Erro ao editar poesia:", error)
    return res.status(500).json({ error: "Erro ao atualizar a poesia." })
  }
}
