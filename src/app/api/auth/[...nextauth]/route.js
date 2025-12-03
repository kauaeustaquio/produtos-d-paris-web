import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import pool from "@/lib/db";

// ---- FUNÇÃO AUXILIAR: BUSCA USUÁRIO NO DB ---- //
async function getUserByEmail(email) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT id, nome, email, senha_hash, rule FROM usuario WHERE email = $1",
      [email]
    );

    const user = res.rows[0];

    if (user) {
      user.role = user.rule;
      delete user.rule;
    }

    return user || null;
  } catch (error) {
    console.error("Erro ao buscar usuário no DB:", error);
    return null;
  } finally {
    client.release();
  }
}

export const authOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // ---- LOGIN GOOGLE ---- //
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ---- LOGIN POR EMAIL/SENHA ---- //
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        const { email, senha } = credentials;

        const user = await getUserByEmail(email);
        if (!user || !user.senha_hash) return null;

        const ok = await compare(senha, user.senha_hash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // ---- BLOQUEIA LOGIN GOOGLE SE NÃO ESTIVER NO BD ---- //
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const existing = await getUserByEmail(profile.email);

        if (!existing) {
          console.log(
            `❌ Google Login Bloqueado: ${profile.email} não está cadastrado.`
          );
          return false;
        }
      }
      return true;
    },

    // ---- TOKEN JWT ---- //
    async jwt({ token, user, account }) {
      // 1) LOGIN VIA CREDENCIAIS
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      // 2) LOGIN VIA GOOGLE
      if (account?.provider === "google") {
        const existing = await getUserByEmail(token.email);

        if (existing) {
          token.id = existing.id;
          token.role = existing.role;
          token.name = existing.nome; // garante nome correto
        }
      }

      return token;
    },

    // ---- SESSÃO ---- //
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role,
        name: token.name,
        email: token.email,
      };
      return session;
    },

    // ---- REDIRECIONAMENTO ---- //
    async redirect({ url, baseUrl }) {
      // permite callbackUrl interno automaticamente
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  // ---- PÁGINAS PERSONALIZADAS ---- //
  pages: {
    signIn: "/telaLogin",
    error: "/telaLogin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
