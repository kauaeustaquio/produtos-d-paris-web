// Arquivo: /api/produtos/route.js
import db from "@/lib/db"; // Cliente PostgreSQL
import { NextResponse } from 'next/server';

// --- Rota GET (Buscar/Listar Produtos com Filtros) ---
// Rota: GET /api/produtos
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        
        // Seleciona todos os campos, garantindo valores padrão para desconto e promoção
        let query = "SELECT *, COALESCE(desconto, 0) as desconto, COALESCE(em_promocao, false) as \"emPromocao\" FROM produtos WHERE 1=1";
        const values = [];
        let paramIndex = 1;

        // Filtro de pesquisa (nome e categoria)
        if (searchTerm) {
            query += ` AND (nome ILIKE $${paramIndex} OR categoria ILIKE $${paramIndex})`;
            values.push(`%${searchTerm}%`);
            paramIndex++;
        }
        
        // Filtro de categoria
        if (category) {
            query += ` AND categoria = $${paramIndex}`;
            values.push(category);
            paramIndex++;
        }

        query += " ORDER BY id DESC"; 

        const result = await db.query(query, values);
        
        // Retorna a lista de produtos
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Erro na busca de produtos (GET):", error);
        return NextResponse.json({ message: 'Falha ao buscar produtos', detail: error.message || 'Erro de servidor' }, { status: 500 });
    }
}

// --- Rota POST (Criar Novo Produto) ---
// Rota: POST /api/produtos
export async function POST(req) {
    try {
        const data = await req.json();
        // Incluindo desconto e emPromocao na desestruturação
        let { nome, categoria, valor, imagem, quantidade, desconto, emPromocao } = data; 
        
        // Conversão e validação
        valor = parseFloat(valor);
        quantidade = parseInt(quantidade) || 0;
        desconto = parseInt(desconto) || 0; 
        emPromocao = Boolean(emPromocao); 

        if (!nome || !categoria || isNaN(valor) || valor === undefined) {
            return NextResponse.json({ error: "Campos obrigatórios faltando ou em formato inválido." }, { status: 400 });
        }

        // INSERT incluindo desconto e em_promocao
        const result = await db.query(
            "INSERT INTO produtos (nome, categoria, valor, imagem, quantidade, desconto, em_promocao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nome, categoria, valor, imagem, quantidade, desconto, emPromocao]
        );
        
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        console.error("ERRO CRÍTICO ao adicionar produto (POST):", err.message || err); 
        
        return NextResponse.json({ 
            error: "Falha ao criar produto.", 
            detail: err.message || 'Erro de servidor'
        }, { status: 500 });
    }
}