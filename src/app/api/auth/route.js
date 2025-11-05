import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import pool from "@/lib/db";

// Fazer a busca do usuário e mapear 'rule' para 'role'
async function getUserByEmail(email) {
    const client = await pool.connect();
    // 🔍 BUSCA POR 'rule' no banco
    const res = await client.query(
        "SELECT id, nome, email, senha_hash, rule FROM usuario WHERE email = $1",
        [email]
    );
    client.release();
    
    const user = res.rows[0];
    if (user) {
        // 🔄 MAPEAMENTO: Transforma 'rule' (do banco) em 'role' (para o NextAuth)
        user.role = user.rule; 
        delete user.rule; // Remove o campo 'rule' para usar apenas 'role'
    }
    return user || null;
}

const authOptions = {
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "Credenciais",
            credentials: {
                email: { label: "E-mail", type: "email" },
                senha: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                const { email, senha } = credentials;
                // getUserByEmail já retorna 'role' (mapeado)
                const user = await getUserByEmail(email); 
                
                if (!user || !user.senha_hash) return null;
                const ok = await compare(senha, user.senha_hash);
                if (!ok) return null;
                
                // Retorna o objeto com a propriedade 'role'
                return { id: user.id, name: user.nome, email: user.email, role: user.role };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Lógica para Login com Google/OAuth
            if (account && profile) {
                const existing = await getUserByEmail(profile.email);
                if (existing) {
                    token.role = existing.role; 
                    token.id = existing.id;
                    token.name = existing.nome;
                } else {
                    // Cria o novo usuário OAuth no banco
                    const client = await pool.connect();
                    // 💾 INSERT usando a coluna 'rule'
                    const res = await client.query(
                        "INSERT INTO usuario (nome, email, rule) VALUES ($1, $2, $3) RETURNING id, rule",
                        [profile.name ?? "Usuário", profile.email, "cliente"] // Defina o 'rule' padrão
                    );
                    client.release();
                    token.id = res.rows[0].id;
                    // 🔄 MAPEAMENTO: Salva como 'role' no token
                    token.role = res.rows[0].rule; 
                    token.name = profile.name;
                }
            }

            // Para login com credenciais (e qualquer user)
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
            }
            return token;
        },

        // É necessário para expor 'role' na sessão do cliente (useSession())
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name ?? session.user.name;
            }
            return session;
        }
    },
    
    pages: {
        signIn: "/novoLogin"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };