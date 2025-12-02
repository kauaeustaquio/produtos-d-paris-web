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

  // Se a rota exige auth e não há token → volta para login
  if (precisaAuth && !token) {
    const url = new URL("/telaLogin", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Se logado e tentar abrir telaLogin → manda para telaPrincipal
  if (token && pathname === "/telaLogin") {
    return NextResponse.redirect(new URL("/telaPrincipal", req.url));
  }

  return NextResponse.next();
}

// MIDDLEWARE EXECUTA SOMENTE NAS ROTAS PRIVADAS
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
    "/admin/:path*",
    "/telaLogin"
  ],
};
