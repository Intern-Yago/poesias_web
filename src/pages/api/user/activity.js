import { prisma } from "../../../lib/prisma"
import { getToken } from "next-auth/jwt"

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro" })
    const legacyToken = req.cookies?.token
    const clientCookie = req.cookies?.poesias_client_id

    const userName = token?.name || token?.email?.split('@')[0] || (typeof req.cookies?.user_name === 'string' ? req.cookies.user_name : null)
    const userEmail = token?.email

    const userKeys = []
    if (userEmail) userKeys.push(`email:${userEmail.toLowerCase()}`)
    if (userName) userKeys.push(`name:${userName.toLowerCase()}`)
    if (legacyToken) userKeys.push(`cookie:${legacyToken}`)
    if (clientCookie) userKeys.push(`guest:${clientCookie}`)

    // If completely no identification, return clean empty result
    if (userKeys.length === 0 && !userName) {
      return res.status(200).json({
        created: [],
        liked: [],
        commented: [],
        likedIds: []
      })
    }

    // 1. Created Poesias
    let createdPoesias = []
    if (userName) {
      createdPoesias = await prisma.poetrys.findMany({
        where: {
          autor: {
            equals: String(userName),
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    // 2. Liked Poesias
    let userLikes = []
    if (userKeys.length > 0) {
      userLikes = await prisma.like.findMany({
        where: {
          userKey: { in: userKeys }
        },
        include: {
          poetry: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }
    const likedPoesias = userLikes.map(l => l.poetry).filter(Boolean)

    // 3. Commented Poesias
    let userComments = []
    if (userName) {
      userComments = await prisma.comment.findMany({
        where: {
          autor: {
            equals: String(userName),
            mode: 'insensitive'
          }
        },
        include: {
          poetry: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    // Deduplicate commented poesias
    const commentedPoesiasMap = {}
    userComments.forEach(c => {
      if (c.poetry && !commentedPoesiasMap[c.poetry.id]) {
        commentedPoesiasMap[c.poetry.id] = c.poetry
      }
    })
    const commentedPoesias = Object.values(commentedPoesiasMap)

    const formatPoetry = (p) => ({
      id: p.id,
      titulo: p.titulo || null,
      autor: p.autor || 'Anônimo',
      mensagem: p.mensagem || '',
      likes: p.likes || 0,
      isPrivate: Boolean(p.isPrivate),
      date: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString()
    })

    return res.status(200).json({
      created: createdPoesias.map(formatPoetry),
      liked: likedPoesias.map(formatPoetry),
      commented: commentedPoesias.map(formatPoetry),
      likedIds: userLikes.map(l => l.poetryId)
    })
  } catch (error) {
    console.error("Erro ao buscar atividade do usuário:", error)
    return res.status(200).json({
      created: [],
      liked: [],
      commented: [],
      likedIds: []
    })
  }
}
