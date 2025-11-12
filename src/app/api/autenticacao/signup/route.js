// src/app/api/autenticacao/signup/route.js

import { NextResponse } from 'next/server';
import pool from "@/lib/db"; 
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { nome, email, senha, telefone } = await request.json(); 

    if (!nome || !email || !senha || !telefone) {
      return NextResponse.json(
        { message: 'Todos os campos (Nome, Email, Telefone e Senha) são obrigatórios.' },
        { status: 400 }
      );
    }
    
    const client = await pool.connect();

    // 1. Verificar email na tabela 'usuario'
    const checkUser = await client.query('SELECT email FROM usuario WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
        client.release();
        return NextResponse.json(
            { message: 'Este e-mail já está cadastrado.' },
            { status: 409 }
        );
    }
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    //Insere na tabela 'usuario' com 'telefone' e 'admin' rule
    const queryText = `
        INSERT INTO usuario (nome, email, telefone, senha_hash, rule) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, nome, email, telefone, rule;
    `;
    
    const res = await client.query(queryText, [
        nome, 
        email, 
        telefone, 
        senhaHash, 
        'admin' 
    ]);
    
    client.release();

    return NextResponse.json(
      { 
        message: 'Usuário administrador cadastrado com sucesso!', 
        user: res.rows[0] 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro no cadastro de usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno ao processar o cadastro.' }, 
      { status: 500 }
    );
  }
}