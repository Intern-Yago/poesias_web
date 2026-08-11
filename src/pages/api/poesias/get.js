import { prisma } from "../../../lib/prisma"

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  try {
    const { id } = req.query || {}
    if (!id) {
      return res.status(400).json({ error: "ID da poesia é obrigatório." })
    }

    const poetry = await prisma.poetrys.findUnique({
      where: { id: String(id) }
    })

    if (!poetry) {
      return res.status(404).json({ error: "Poesia não encontrada." })
    }

    return res.status(200).json({
      poetry: {
        id: poetry.id,
        titulo: poetry.titulo || null,
        autor: poetry.autor || 'Anônimo',
        mensagem: poetry.mensagem || '',
        likes: poetry.likes || 0,
        isPrivate: Boolean(poetry.isPrivate),
        date: poetry.createdAt ? poetry.createdAt.toISOString() : new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Erro ao buscar poesia:", error)
    return res.status(500).json({ error: "Erro interno ao buscar a poesia." })
  }
}
