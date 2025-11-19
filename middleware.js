import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Rotas que exigem estar logado
    const precisaAuth =
        pathname.startsWith("/perfil") ||
        pathname.startsWith("/usuario") ||
        pathname.startsWith("/historico") ||
        pathname.startsWith("/clientes") ||
        pathname.startsWith("/telaPrincipal") ||  
        pathname.startsWith("/telaPedidos") ||     
        pathname.startsWith("/telaEstoque") ||     
        pathname.startsWith("/telaInfo");          

    // Se precisa de login e não tem token → redireciona
    if (precisaAuth && !token) {
        const url = new URL("/novoLogin", req.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    // Controle de admin
    if (pathname.startsWith("/admin")) {
        if (!token) return NextResponse.redirect(new URL("/novoLogin", req.url));
        if (token.role !== "admin") {
            return NextResponse.redirect(new URL("/nao-autorizado", req.url));
        }
    }

    return NextResponse.next();
}

// ⛔ Aqui estava o erro: faltava colocar as rotas no matcher
export const config = {
    matcher: [
        "/perfil/:path*",
        "/usuario/:path*",
        "/historico/:path*",
        "/clientes/:path*",
        "/telaPrincipal/:path*",   // AGORA FUNCIONA
        "/telaPedidos/:path*",     
        "/telaEstoque/:path*",
        "/telaInfo/:path*",
        "/admin/:path*",
    ],
};
