import { prisma } from "../../../lib/prisma"

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { poetryId } = req.query
    if (!poetryId) {
      return res.status(400).json({ error: "poetryId é obrigatório." })
    }

    try {
      const comments = await prisma.comment.findMany({
        where: { poetryId },
        orderBy: { createdAt: 'asc' }
      })
      return res.status(200).json({ comments })
    } catch (error) {
      console.error("Erro ao buscar comentários:", error)
      return res.status(200).json({ comments: [] })
    }
  }

  if (req.method === 'POST') {
    const { poetryId, autor, texto } = req.body || {}

    if (!poetryId) {
      return res.status(400).json({ error: "poetryId é obrigatório." })
    }
    if (!autor || typeof autor !== 'string' || autor.trim().length === 0) {
      return res.status(400).json({ error: "Autor do comentário é obrigatório." })
    }
    if (!texto || typeof texto !== 'string' || texto.trim().length === 0) {
      return res.status(400).json({ error: "O comentário não pode ser vazio." })
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          poetryId,
          autor: autor.trim(),
          texto: texto.trim()
        }
      })
      return res.status(201).json({ comment: newComment })
    } catch (error) {
      console.error("Erro ao criar comentário:", error)
      return res.status(500).json({ error: "Erro ao salvar comentário." })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Método ${req.method} não permitido` })
}
