import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { nome, email } = await request.json();

    // 1. Validação básica
    if (!nome || !email) {
      return NextResponse.json({ message: 'Nome e email são obrigatórios.' }, { status: 400 });
    }

    // 2. Verifica se o usuário já existe
    const usuarioExistente = await db.query('SELECT email FROM usuario WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return NextResponse.json({ message: 'Este email já está cadastrado.' }, { status: 409 });
    }

    // 3. Insere o novo usuário no banco de dados
    const result = await db.query(
      'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );

    const novoUsuario = result.rows[0];

    return NextResponse.json({
      message: 'Usuário cadastrado com sucesso!',
      user: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}