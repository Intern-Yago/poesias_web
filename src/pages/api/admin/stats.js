import { prisma } from "../../../lib/prisma"
import { checkIsAdmin } from "../../../lib/admin"

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  const isAdmin = await checkIsAdmin(req)
  if (!isAdmin) {
    return res.status(403).json({ error: "Acesso restrito a administradores." })
  }

  try {
    const totalPoesias = await prisma.poetrys.count()
    const totalComments = await prisma.comment.count()
    
    // Sum all likes
    const likesAggregate = await prisma.poetrys.aggregate({
      _sum: {
        likes: true
      }
    })
    const totalLikes = likesAggregate._sum?.likes || 0

    const pendingReports = await prisma.report.count({
      where: { status: 'PENDENTE' }
    })

    const totalReports = await prisma.report.count()

    let totalUsers = 0
    let usersList = []
    try {
      totalUsers = await prisma.user.count()
      usersList = await prisma.user.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
      })
    } catch (uErr) {
      console.warn("User table query warning:", uErr)
    }

    const recentPoesias = await prisma.poetrys.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true, reports: true }
        }
      }
    })

    const recentComments = await prisma.comment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        poetry: {
          select: { id: true, titulo: true, autor: true }
        }
      }
    })

    return res.status(200).json({
      stats: {
        totalPoesias,
        totalComments,
        totalLikes,
        pendingReports,
        totalReports,
        totalUsers
      },
      recentPoesias,
      recentComments,
      usersList
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas do admin:", error)
    return res.status(500).json({ error: "Erro ao buscar métricas da plataforma." })
  }
}
