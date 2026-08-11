import { prisma } from "../../../lib/prisma"
import { getToken } from "next-auth/jwt"
import { checkRateLimit } from "../../../lib/rateLimit"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("YOUR_PASSWORD")) {
    return res.status(400).json({
      error: "O banco de dados ainda não foi conectado! Configure a variável DATABASE_URL no painel da Vercel ou no arquivo .env local com a senha do seu Supabase."
    })
  }

  try {
    const rateLimit = checkRateLimit(req, 'create_post', { limit: 10, windowMs: 10 * 60 * 1000 })
    if (!rateLimit.success) {
      const mins = Math.ceil(rateLimit.resetInSeconds / 60)
      return res.status(429).json({
        error: `Você atingiu o limite de publicações temporário. Por favor, aguarde ${mins} minuto(s) para publicar novamente.`
      })
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro" })
    const legacyToken = req.cookies?.token || req.headers?.cookie

    if (!token && !legacyToken) {
      return res.status(401).json({ error: "Acesso não autorizado. Faça login para publicar." })
    }

    const { autor, mensagem, titulo, isPrivate } = req.body || {}

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
    const cleanTitulo = titulo && typeof titulo === 'string' && titulo.trim() ? titulo.trim().slice(0, 150) : null

    const dataToSave = {
      autor: cleanAutor,
      mensagem: cleanMensagem,
      isPrivate: Boolean(isPrivate)
    }
    if (cleanTitulo) {
      dataToSave.titulo = cleanTitulo
    }

    const newPoetry = await prisma.poetrys.create({
      data: dataToSave
    })

    return res.status(201).json({ message: "Poesia publicada com sucesso!", poetry: newPoetry })
  } catch (error) {
    console.error("Erro ao salvar poesia:", error)
    return res.status(500).json({ error: error.message || "Erro interno ao salvar a poesia. Tente novamente mais tarde." })
  }
}