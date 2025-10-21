import { NextResponse } from 'next/server';
import db from "@/lib/db";
import bcrypt from 'bcryptjs'; // Importa a biblioteca

// Define o custo do hash (quanto maior, mais seguro, mas mais lento)
const saltRounds = 10; 

export async function POST(request) {
  try {
    // Adiciona 'senha' para ser desestruturada
    const { nome, email, senha } = await request.json(); 

    // 1. Validação básica (Nome, Email e SENHA são obrigatórios)
    if (!nome || !email || !senha) { 
      return NextResponse.json({ message: 'Nome, email e senha são obrigatórios.' }, { status: 400 });
    }

    // Opcional: Adicionar validação de formato de email e complexidade da senha aqui.
    
    // --- Etapa Adicionada: Hash da Senha ---
    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // 2. Verifica se o usuário já existe
    const usuarioExistente = await db.query('SELECT email FROM usuario WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return NextResponse.json({ message: 'Este email já está cadastrado.' }, { status: 409 });
    }

    // 3. Insere o novo usuário no banco de dados, incluindo o HASH da senha
    // ATENÇÃO: Certifique-se de que sua tabela 'usuario' tenha uma coluna 'senha' 
    // (ou outro nome, como 'password_hash') do tipo TEXT ou VARCHAR
    const result = await db.query(
      'INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, hashedPassword] // Usa o hashedPassword
    );

    const novoUsuario = result.rows[0];

    // ATENÇÃO: Nunca retorne a senha (mesmo o hash) na resposta!
    return NextResponse.json({
      message: 'Usuário cadastrado com sucesso!',
      user: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    // Erros podem incluir falha no hash ou falha no DB
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}