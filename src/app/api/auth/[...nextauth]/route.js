import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import pool from "@/lib/db";

// --- Função Auxiliar: Busca Usuário no DB ---
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
    // LOGIN GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // LOGIN COM EMAIL + SENHA
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
    // BLOQUEIA LOGIN GOOGLE SE NÃO ESTIVER CADASTRADO
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const existing = await getUserByEmail(profile.email);

        if (!existing) {
          console.log(
            `Tentativa bloqueada: usuário Google ${profile.email} não encontrado no DB.`
          );
          return false; // cai em /telaLogin?error=AccessDenied
        }
      }
      return true;
    },

    // TOKEN JWT
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      if (account?.provider === "google" && !token.role) {
        const existing = await getUserByEmail(token.email);
        if (existing) {
          token.id = existing.id;
          token.role = existing.role;
          token.name = existing.nome;
        }
      }

      return token;
    },

    // SESSÃO
    async session({ session, token }) {
      if (!session.user) session.user = {};

      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;

      return session;
    },

    // REDIRECIONAMENTO
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url; // Permite callbackUrl (ex: /telaPrincipal)
      return baseUrl;
    },
  },

  pages: {
    signIn: "/telaLogin",
    error: "/telaLogin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
