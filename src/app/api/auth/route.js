import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import pool from "@/lib/db";


async function getUserByEmail(email) {
    const client = await pool.connect();
    const res = await client.query(
        "SELECT id, nome, email, senha_hash, rule FROM usuario WHERE email = $1",
        [email]
    );
    client.release();
    
    const user = res.rows[0];
    if (user) {
        //'rule' do bd para 'role' do Next
        user.role = user.rule; 
        delete user.rule; 
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
                const user = await getUserByEmail(email); 
                
                if (!user || !user.senha_hash) return null;
                const ok = await compare(senha, user.senha_hash);
                if (!ok) return null;
                
                return { id: user.id, name: user.nome, email: user.email, role: user.role };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user, account, profile }) {
            //Google/OAuth (login)
            if (account && profile) {
                const existing = await getUserByEmail(profile.email);
                if (existing) {
                    token.role = existing.role; 
                    token.id = existing.id;
                    token.name = existing.nome;
                } else {
                    //Novo usuário OAuth no banco
                    const client = await pool.connect();
                    const res = await client.query(
                        "INSERT INTO usuario (nome, email, rule) VALUES ($1, $2, $3) RETURNING id, rule",
                        [profile.name ?? "Usuário", profile.email, "cliente"] 
                    );
                    client.release();
                    token.id = res.rows[0].id;
                    token.role = res.rows[0].rule; 
                    token.name = profile.name;
                }
            }

            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
            }
            return token;
        },

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