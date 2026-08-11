import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma";

const providers = [];

const githubClientId = process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET;

if (githubClientId && githubClientSecret) {
  providers.push(
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET,
    })
  );
}

if (providers.length === 0) {
  providers.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize() {
        return null;
      }
    })
  );
}

export default NextAuth({
  providers,
  secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro",
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (user?.email) {
        try {
          await prisma.user.upsert({
            where: { email: user.email.toLowerCase() },
            update: {
              name: user.name || user.email.split('@')[0],
              provider: account?.provider || 'oauth'
            },
            create: {
              name: user.name || user.email.split('@')[0],
              email: user.email.toLowerCase(),
              provider: account?.provider || 'oauth'
            }
          });
        } catch (e) {
          console.error("Erro ao sincronizar usuário no BD:", e);
        }
      }
      return true;
    }
  }
});