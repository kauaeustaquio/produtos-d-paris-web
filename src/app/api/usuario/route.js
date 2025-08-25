import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    // 1. Recebe os dados do corpo da requisição
    const data = await request.json();
    const { nome, email, senha } = data;

    // 2. Valida os dados (opcional, mas recomendado)
    if (!nome || !email || !senha) {
      return NextResponse.json({
        message: 'Nome, email e senha são obrigatórios.',
        status: 400
      });
    }

    // 3. Insere os dados no banco de dados
    const result = await db.query(
      'INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );

    // 4. Retorna uma resposta de sucesso
    return NextResponse.json({
      message: 'Usuário cadastrado com sucesso!',
      usuario: result.rows[0] // Retorna o usuário criado
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    // 5. Retorna uma resposta de erro em caso de falha
    return NextResponse.json({
      message: 'Erro interno ao cadastrar usuário.',
      error: error.message
    }, { status: 500 });
  }
}