import { prisma } from "../../../lib/prisma"
import { getToken } from "next-auth/jwt"

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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro" })
    
    let userKey = ''
    if (token?.email) {
      userKey = `email:${token.email.toLowerCase()}`
    } else if (token?.name) {
      userKey = `name:${token.name.toLowerCase()}`
    } else if (req.cookies?.token) {
      userKey = `cookie:${req.cookies.token}`
    } else {
      let clientCookie = req.cookies?.poesias_client_id
      if (!clientCookie) {
        clientCookie = `guest_${Math.random().toString(36).substring(2)}_${Date.now()}`
        res.setHeader('Set-Cookie', `poesias_client_id=${clientCookie}; Path=/; Max-Age=31536000; SameSite=Lax`)
      }
      userKey = `guest:${clientCookie}`
    }

    // Check if like record exists
    const existingLike = await prisma.like.findUnique({
      where: {
        poetryId_userKey: {
          poetryId: String(id),
          userKey
        }
      }
    })

    let liked = false
    let updatedPoetry = null

    if (existingLike) {
      // Remove like (unlike)
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      updatedPoetry = await prisma.poetrys.update({
        where: { id: String(id) },
        data: { likes: { decrement: 1 } }
      })
      liked = false
    } else {
      // Create like
      await prisma.like.create({
        data: {
          poetryId: String(id),
          userKey
        }
      })
      updatedPoetry = await prisma.poetrys.update({
        where: { id: String(id) },
        data: { likes: { increment: 1 } }
      })
      liked = true
    }

    // Ensure likes count never drops below 0
    const finalLikes = Math.max(0, updatedPoetry.likes)

    return res.status(200).json({ liked, likes: finalLikes })
  } catch (error) {
    console.error("Erro ao curtir/descurtir poesia:", error)
    return res.status(500).json({ error: "Erro ao processar curtida." })
  }
}
