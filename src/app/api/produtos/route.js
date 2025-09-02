import db from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const query = "SELECT * FROM produtos WHERE nome ILIKE $1 OR categoria ILIKE $1";
    const values = [`%${searchTerm}%`];
    
    const result = await db.query(query, values);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro na busca de produtos:", error);
    return NextResponse.json({ message: 'Falha ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { nome, categoria, valor, imagem } = data;

    if (!nome || !categoria || !valor) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando" }), { status: 400 });
    }

    await db.query(
      "INSERT INTO produtos (nome, categoria, valor, imagem) VALUES ($1, $2, $3, $4)",
      [nome, categoria, valor, imagem]
    );

    return new Response(JSON.stringify({ message: "Produto criado com sucesso" }), { status: 201 });
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    return new Response(JSON.stringify({ error: "Erro no servidor" }), { status: 500 });
  }
}