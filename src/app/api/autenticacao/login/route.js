import { NextResponse } from 'next/server';
import pool from "@/lib/db"; 
import bcrypt from 'bcryptjs'; 

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    //Validação 
    if (!email || !senha) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios para o login.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    const result = await client.query(
      'SELECT id, nome, senha_hash, role FROM consumidor WHERE email = $1',
      [email]
    );

    client.release(); 

    const user = result.rows[0];

    //Usuário existe?
    if (!user) {

      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) {

      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Login realizado com sucesso!',
        user: { id: user.id, nome: user.nome, email: email, role: user.role }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao processar o login do consumidor:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}