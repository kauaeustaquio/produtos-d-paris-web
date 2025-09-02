// app/api/usuarios/route.js

import db from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM usuario");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro na busca de usuários:", error);
    return NextResponse.json({ message: 'Falha ao buscar usuários' }, { status: 500 });
  }
}