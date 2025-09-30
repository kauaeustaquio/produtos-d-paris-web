import db from "@/lib/db"; // Presumindo que este é o seu cliente PostgreSQL
import { NextResponse } from 'next/server';

// Rota GET (Buscar/Listar Produtos com Filtros)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    // Configura a query base e a lista de valores
    let query = "SELECT * FROM produtos WHERE 1=1";
    const values = [];
    let paramIndex = 1;

    // Adiciona o filtro de pesquisa (nome e categoria)
    if (searchTerm) {
      query += ` AND (nome ILIKE $${paramIndex} OR categoria ILIKE $${paramIndex})`;
      values.push(`%${searchTerm}%`);
      paramIndex++;
    }
    
    // Adiciona o filtro de categoria
    if (category) {
      query += ` AND categoria = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    query += " ORDER BY id DESC"; // Ordena do mais novo para o mais antigo

    const result = await db.query(query, values);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro na busca de produtos:", error);
    return NextResponse.json({ message: 'Falha ao buscar produtos' }, { status: 500 });
  }
}

// Rota POST (Criar Novo Produto)
export async function POST(req) {
  try {
    const data = await req.json();
    // Certifique-se de que a quantidade é incluída ou padronizada se o seu BD exigir
    const { nome, categoria, valor, imagem, quantidade = 0 } = data; 

    if (!nome || !categoria || valor === undefined) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    await db.query(
      "INSERT INTO produtos (nome, categoria, valor, imagem, quantidade) VALUES ($1, $2, $3, $4, $5)",
      [nome, categoria, valor, imagem, quantidade]
    );

    return NextResponse.json({ message: "Produto criado com sucesso" }, { status: 201 });
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}

// --- NOVAS ROTAS ---

// Rota PUT/PATCH (Atualizar Produto Existente)
// Esta rota é para a edição do produto.
// Presumimos que esta rota está em /api/produtos/[id]/route.js, 
// ou o `id` é passado no corpo da requisição se esta rota for /api/produtos/route.js
export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, nome, categoria, valor, imagem, quantidade } = data;

    if (!id || !nome || !categoria || valor === undefined) {
      return NextResponse.json({ error: "ID ou campos obrigatórios faltando" }, { status: 400 });
    }
    
    // A query de atualização deve incluir todos os campos que podem ser alterados
    await db.query(
      `UPDATE produtos 
       SET nome = $1, categoria = $2, valor = $3, imagem = $4, quantidade = $5
       WHERE id = $6`,
      [nome, categoria, valor, imagem, quantidade || 0, id] // Assumindo `quantidade` é um campo no seu BD
    );

    return NextResponse.json({ message: "Produto atualizado com sucesso" }, { status: 200 });

  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}

// Rota DELETE (Excluir Produto)
// Esta rota é para a exclusão do produto.
// Presumimos que esta rota está em /api/produtos/[id]/route.js
export async function DELETE(req) {
  try {
    const data = await req.json();
    const { id } = data; // O ID deve ser enviado no corpo da requisição para esta rota

    if (!id) {
      return NextResponse.json({ error: "ID do produto faltando" }, { status: 400 });
    }
    
    await db.query("DELETE FROM produtos WHERE id = $1", [id]);

    // O status 204 No Content é o ideal para exclusão bem-sucedida sem retorno de corpo
    return new Response(null, { status: 204 }); 

  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}