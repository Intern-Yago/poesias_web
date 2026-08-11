import { prisma } from "../../../lib/prisma"
import crypto from "crypto"

function hashPassword(password) {
  const salt = process.env.NEXTAUTH_SECRET || "poesias_salt_secure_2026"
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Método ${req.method} não permitido` })
  }

  try {
    const { name, email, password } = req.body || {}

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: "E-mail ou usuário é obrigatório." })
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ error: "A senha é obrigatória." })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name && typeof name === 'string' && name.trim() 
      ? name.trim() 
      : cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (existing) {
      return res.status(400).json({ error: "Este e-mail/usuário já possui uma conta cadastrada. Faça login." })
    }

    // Create user with hashed password
    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashPassword(password.trim()),
        provider: 'credentials'
      }
    })

    return res.status(201).json({
      message: "Conta criada com sucesso!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return res.status(500).json({ error: "Erro interno ao criar conta." })
  }
}
