// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ROTAS PROTEGIDAS
  const rotasProtegidas = [
    "/perfil",
    "/usuario",
    "/historico",
    "/clientes",
    "/telaPrincipal",
    "/telaPedidos",
    "/telaEstoque",
    "/telaInfo",
    "/admin"
  ];

  const precisaAuth = rotasProtegidas.some((rota) =>
    pathname.startsWith(rota)
  );

  // Se tentar acessar rota protegida sem estar logado → manda para login
  if (precisaAuth && !token) {
    const url = new URL("/telaLogin", req.url);
    url.searchParams.set("callbackUrl", pathname); 
    return NextResponse.redirect(url);
  }

  // Se já estiver logado e tentar acessar a página de login, redireciona para Principal
  if (token && pathname === "/telaLogin") {
    return NextResponse.redirect(new URL("/telaPrincipal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/perfil/:path*",
    "/usuario/:path*",
    "/historico/:path*",
    "/clientes/:path*",
    "/telaPrincipal/:path*",
    "/telaPedidos/:path*",
    "/telaEstoque/:path*",
    "/telaInfo/:path*",
    "/admin/:path*"
  ]
};
