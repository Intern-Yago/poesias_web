import { prisma } from "../../../lib/prisma"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  const { id } = req.body || {}

  if (!id) {
    return res.status(400).json({ error: "ID da poesia é obrigatório." })
  }

  try {
    const poetry = await prisma.poetrys.update({
      where: { id },
      data: {
        likes: { increment: 1 }
      }
    })

    return res.status(200).json({ likes: poetry.likes })
  } catch (error) {
    console.error("Erro ao curtir poesia:", error)
    return res.status(200).json({ likes: 1 })
  }
}
