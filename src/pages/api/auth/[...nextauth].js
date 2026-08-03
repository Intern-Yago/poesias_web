import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const providers = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
} else {
  // Fallback GitHub provider to avoid crash if env not set yet
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "demo_github_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "demo_github_secret",
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

export default NextAuth({
  providers,
  secret: process.env.NEXTAUTH_SECRET || "poesias_secret_key_2026_super_seguro",
  pages: {
    signIn: '/login',
    error: '/login',
  },
});