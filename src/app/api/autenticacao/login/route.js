import { NextResponse } from 'next/server';
import pool from "@/lib/db"; // Importando a conexão com o banco de dados
import bcrypt from 'bcryptjs'; // Importar o bcrypt para a verificação de hash

export async function POST(request) {
  try {
    // 1. Receber as credenciais (melhor usar email em vez de nome, pois email é único)
    const { email, senha } = await request.json();

    // 2. Validação básica de campos
    if (!email || !senha) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios para o login.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    // 3. Buscar o consumidor pelo email
    // É obrigatório buscar o campo 'senha_hash' (ou o nome que você usa para o hash)
    const result = await client.query(
      'SELECT id, nome, senha_hash, role FROM consumidor WHERE email = $1',
      [email]
    );

    client.release(); // Sempre liberar a conexão após a consulta

    const user = result.rows[0];

    // 4. Verificar se o usuário existe
    if (!user) {
      // Mensagem genérica para segurança (Não informa se o erro é no email ou na senha)
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    // 5. Comparar a senha fornecida com o hash armazenado no banco de dados
    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) {
      // Mensagem genérica para segurança
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    // 6. Login bem-sucedido: Retornar dados do usuário (SEM a senha hasheada)
    return NextResponse.json(
      {
        message: 'Login realizado com sucesso!',
        user: { id: user.id, nome: user.nome, email: email, role: user.role }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao processar o login do consumidor:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}