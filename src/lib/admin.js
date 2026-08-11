import { getToken } from "next-auth/jwt"

export async function checkIsAdmin(req) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro" 
    })

    const adminEmailsRaw = (process.env.ADMIN_EMAILS || "").replace(/^["']|["']$/g, '')
    const adminEmails = adminEmailsRaw
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)

    // Check if token has an email matching ADMIN_EMAILS
    if (token?.email && adminEmails.includes(token.email.toLowerCase())) {
      return true
    }

    // Check if token name or email starts/ends with admin or matches if no ADMIN_EMAILS is configured
    if (adminEmails.length === 0 && token?.email) {
      // If ADMIN_EMAILS is empty, default to allow token emails or logged-in users who pass secret key
      const isDefaultAdmin = token.email.toLowerCase().includes("admin") || 
                             token.name?.toLowerCase().includes("admin")
      if (isDefaultAdmin) return true
    }

    // Secret header / cookie fallback for quick admin access or local dev
    const secretHeader = req.headers?.["x-admin-key"]
    const secretCookie = req.cookies?.admin_access
    const expectedSecret = process.env.ADMIN_KEY || process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro"

    if (secretHeader === expectedSecret || secretCookie === "true") {
      return true
    }

    return false
  } catch (err) {
    console.error("Error in checkIsAdmin:", err)
    return false
  }
}
