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
      user.role = user.rule; // renomeia 'rule' -> 'role'
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
// ---------------------------------------------

export const authOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, // Garante que o secret esteja definido

  providers: [
    // 1. LOGIN COM GOOGLE (OAuth)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    // 2. LOGIN COM E-MAIL + SENHA (Credentials)
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const { email, senha } = credentials;
        
        // A busca e a verificação de senha devem ser feitas aqui.
        const user = await getUserByEmail(email);
        if (!user || !user.senha_hash) return null;

        const ok = await compare(senha, user.senha_hash);
        if (!ok) return null;

        // Retorna o objeto do usuário que será anexado ao token
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
    // NOVO CALLBACK: Bloqueia usuários do Google não cadastrados antes da sessão ser criada
    // Isso garante que o redirecionamento de erro seja correto.
    async signIn({ account, profile }) {
        if (account?.provider === "google") {
            // Verifica se o usuário do Google existe no seu DB
            const existing = await getUserByEmail(profile.email);
            
            if (!existing) {
                // Se não existe, bloqueia o login. NextAuth redireciona para /novoLogin?error=AccessDenied
                console.log(`Tentativa de login bloqueada: Usuário ${profile.email} não cadastrado.`);
                return false; 
            }
        }
        // Permite o login (para Credentials e Google se o usuário existir)
        return true; 
    },

    async jwt({ token, user, account }) {
        // 1. Credenciais ou Login Inicial do Google: Anexa dados customizados do usuário ao token
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.name = user.name;
          token.email = user.email;
        }
        
        // 2. Se o user é do Google e não veio com role (OAuth padrão)
        // Isso é uma segurança adicional, embora o callback signIn já garanta a existência.
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

    async session({ session, token }) {
      if (!session.user) session.user = {};
      // Passa os dados do token para a sessão do cliente
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;

      return session;
    },

    // AJUSTE DE REDIRECIONAMENTO: O NextAuth usa o callbackUrl. Não force a baseURL aqui.
    async redirect({ url, baseUrl }) {
      // Se a URL for local, usa a URL fornecida (callbackUrl, que será /telaPrincipal)
      if (url.startsWith(baseUrl)) return url;
      // Se for uma URL externa, retorna para a base
      return baseUrl; 
    }
  },

  pages: {
    signIn: "/novoLogin", // DEVE SER EXATAMENTE O CAMINHO DA PÁGINA
    error: "/novoLogin"  // Onde o erro AccessDenied será exibido
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };