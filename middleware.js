import { NextResponse } from "next/server";
// 🛠️ CORREÇÃO: NextAuth.js mudou. 'getToken' agora é importado diretamente de 'next-auth'.
import { getToken } from "next-auth"; 

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const precisaAuth =
        pathname.startsWith("/perfil") ||
        pathname.startsWith("/usuario") ||
        pathname.startsWith("/historico") ||
        pathname.startsWith("/clientes");

    // 1. Lógica de Autenticação (Acesso a rotas protegidas)
    // Se precisa de autenticação E não tem token, redireciona para o login.
    if (precisaAuth && !token) {
        const url = new URL("/novoLogin", req.url);
        // Adiciona callbackUrl para voltar para a página original após o login
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    // 2. Lógica de Autorização (Acesso a rotas de Admin)
    if (pathname.startsWith("/admin")) {
        // Se a rota for de admin e não tiver token (não logado), redireciona para o login.
        if (!token) return NextResponse.redirect(new URL("/novoLogin", req.url));
        
        // Se a rota for de admin, está logado, mas a role não é "admin", nega o acesso.
        if (token.role !== "admin")
            return NextResponse.redirect(new URL("/nao-autorizado", req.url));
    }

    // Se nenhuma das condições de redirecionamento for atendida, permite o acesso.
    return NextResponse.next();
}

// O middleware vai interceptar essas rotas.
export const config = {
    matcher: [
        "/perfil/:path*",
        "/usuario/:path*",
        "/historico/:path*",
        "/clientes/:path*",
        "/admin/:path*",
    ],
};