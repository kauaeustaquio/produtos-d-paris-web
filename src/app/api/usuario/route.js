import { NextResponse } from 'next/server';
import db from "@/lib/db";
import bcrypt from 'bcryptjs'; 

const saltRounds = 12; 

export async function POST(request) {
  try {

    const { nome, email, senha } = await request.json(); 

    //(Nome, Email e SENHA são obrigatórios)
    if (!nome || !email || !senha) { 
      return NextResponse.json({ message: 'Nome, email e senha são obrigatórios.' }, { status: 400 });
    }

    //hash da senha
    const hashedPassword = await bcrypt.hash(senha, 12);

    //usuário já existe?
    const usuarioExistente = await db.query('SELECT email FROM usuario WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return NextResponse.json({ message: 'Este email já está cadastrado.' }, { status: 409 });
    }

    // 3. Insere 
    const result = await db.query(
      'INSERT INTO usuario (nome, email, telefone, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, hashedPassword] 
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