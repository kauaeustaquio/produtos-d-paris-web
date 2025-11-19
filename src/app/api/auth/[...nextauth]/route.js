import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import pool from "@/lib/db";

// Função para buscar usuário por e-mail
async function getUserByEmail(email) {
  const client = await pool.connect();
  const res = await client.query(
    "SELECT id, nome, email, senha_hash, rule FROM usuario WHERE email = $1",
    [email]
  );
  client.release();

  const user = res.rows[0];
  if (user) {
    user.role = user.rule; // renomeia rule -> role
    delete user.rule;
  }
  return user || null;
}

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    // LOGIN COM GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    // LOGIN COM E-MAIL + SENHA
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" }
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
          role: user.role
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Login Google
      if (account?.provider === "google") {
        const gmail = profile?.email;
        if (!gmail) return token;

        const existing = await getUserByEmail(gmail);
        if (!existing) {
          token.error = "usuario-nao-cadastrado"; // só marca o erro no token
          return token;
        }

        token.id = existing.id;
        token.role = existing.role;
        token.name = existing.nome;
        token.email = gmail;
      }

      // Login Credenciais
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) session.user = {};
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;

      if (token.error) session.error = token.error; // passa o erro para o frontend
      return session;
    },

    // Redirecionamento
    async redirect({ url, baseUrl }) {
      return baseUrl; // Sempre redireciona para a home, o erro será tratado no frontend
    }
  },

  pages: {
    signIn: "/novoLogin"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
