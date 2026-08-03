import { prisma } from "../../../lib/prisma"
import { getToken } from "next-auth/jwt"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const legacyToken = req.cookies.token

    if (!token && !legacyToken) {
      return res.status(401).json({ error: "Acesso não autorizado. Faça login para publicar." })
    }

    const { autor, mensagem } = req.body || {}

    // Input validation
    if (!autor || typeof autor !== 'string' || autor.trim().length === 0) {
      return res.status(400).json({ error: "O nome do autor é obrigatório." })
    }

    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length === 0) {
      return res.status(400).json({ error: "A poesia/mensagem não pode estar em branco." })
    }

    if (autor.trim().length > 100) {
      return res.status(400).json({ error: "O nome do autor deve ter no máximo 100 caracteres." })
    }

    if (mensagem.trim().length > 3000) {
      return res.status(400).json({ error: "A poesia deve ter no máximo 3000 caracteres." })
    }

    const cleanAutor = autor.trim()
    const cleanMensagem = mensagem.trim()

    const newPoetry = await prisma.poetrys.create({
      data: {
        autor: cleanAutor,
        mensagem: cleanMensagem
      }
    })

    return res.status(201).json({ message: "Poesia publicada com sucesso!", poetry: newPoetry })
  } catch (error) {
    console.error("Erro ao salvar poesia:", error)
    return res.status(500).json({ error: "Erro interno ao salvar a poesia. Tente novamente mais tarde." })
  }
}