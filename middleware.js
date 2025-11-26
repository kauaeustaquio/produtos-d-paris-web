// middleware.js

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    // 1. Obter o Token de Sessão
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // --- Definição das Rotas ---

    // Rotas que não devem ser acessadas se o usuário estiver logado
    const rotasPublicas = ["/", "/novoLogin", "/nao-autorizado"];
    
    // Rotas que exigem autenticação
    const rotasProtegidas = [
        "/perfil",
        "/usuario",
        "/historico",
        "/clientes",
        "/telaPrincipal",
        "/telaPedidos",
        "/telaEstoque",
        "/telaInfo",
    ];

    const precisaAuth = rotasProtegidas.some(rota => pathname.startsWith(rota));
    
    // --- Lógica de Redirecionamento ---

    // 2. Bloqueia Acesso à Raiz/Login se o Usuário Estiver Logado
    // Se o usuário tem token e está tentando ir para a raiz ou tela de login, 
    // force o redirecionamento para a tela principal para evitar loops.
    if (token && (pathname === "/" || pathname.startsWith("/novoLogin"))) {
        return NextResponse.redirect(new URL("/telaPrincipal", req.url));
    }

    // 3. Bloqueio de Acesso a Rotas Protegidas (Usuário Não Logado)
    // Se a rota precisa de login E o usuário NÃO tem token, redireciona para o login.
    if (precisaAuth && !token) {
        const url = new URL("/novoLogin", req.url);
        // Salva a rota original para redirecionar após o login
        url.searchParams.set("callbackUrl", pathname); 
        return NextResponse.redirect(url);
    }

    // 4. Controle de Admin (Exemplo de Permissão)
    if (pathname.startsWith("/admin")) {
        // Se a rota é /admin e não tem token, a condição 3 já redirecionou.
        
        // Verifica a permissão de role
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/nao-autorizado", req.url));
        }
    }

    // 5. Permite o Acesso
    return NextResponse.next();
}

// Configuração: Define as rotas onde o middleware será executado
export const config = {
    matcher: [
        "/", // Inclui a rota raiz para a lógica de bloqueio de usuários logados
        "/novoLogin", // Inclui para bloquear acesso de usuários logados
        "/perfil/:path*",
        "/usuario/:path*",
        "/historico/:path*",
        "/clientes/:path*",
        "/telaPrincipal/:path*",
        "/telaPedidos/:path*",
        "/telaEstoque/:path*",
        "/telaInfo/:path*",
        "/admin/:path*",
    ],
};