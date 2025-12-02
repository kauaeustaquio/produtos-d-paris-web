// app/api/produtos/route.js

import db from "@/lib/db"; 
import { put } from "@vercel/blob";
import { NextResponse } from 'next/server';

// =======================================================
// Rota GET: Busca Produtos (com JOIN na tabela Categorias)
// =======================================================
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const categoryFilter = searchParams.get('category') || '';

        let query = `
            SELECT 
                p.*, 
                c.nome AS nome_categoria,
                c.id AS categoria_id,
                c.imagem_url AS imagem_categoria,
                COALESCE(p.desconto, 0) as desconto, 
                COALESCE(p.em_promocao, false) as "emPromocao" 
            FROM produtos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE 1=1
        `;
        const values = [];
        let paramIndex = 1;

        if (searchTerm) {
            query += ` AND (p.nome ILIKE $${paramIndex} OR c.nome ILIKE $${paramIndex})`;
            values.push(`%${searchTerm}%`);
            paramIndex++;
        }

        if (categoryFilter) {
            query += ` AND c.nome = $${paramIndex}`;
            values.push(categoryFilter);
            paramIndex++;
        }

        query += " ORDER BY p.id DESC";

        const result = await db.query(query, values);

        return NextResponse.json(result.rows);

    } catch (error) {
        console.error("Erro na busca de produtos (GET):", error);
        return NextResponse.json({
            message: 'Falha ao buscar produtos',
            detail: error.message || 'Erro de servidor'
        }, { status: 500 });
    }
}

// =======================================================
// Rota POST: Criar Produto
// =======================================================
export async function POST(req) {
    let imageUrl = null;

    try {
        const formData = await req.formData();

        const nome = formData.get('nome');
        const categoriaId = parseInt(formData.get('categoriaId'));
        const valor = parseFloat(formData.get('valor'));
        const imagemFile = formData.get('imagem');

        const quantidade = parseInt(formData.get('quantidade')) || 0;
        const desconto = parseInt(formData.get('desconto')) || 0;
        const emPromocao = formData.get('emPromocao') === 'true';

        if (!nome || isNaN(categoriaId) || isNaN(valor) || !imagemFile) {
            return NextResponse.json({
                error: "Campos obrigatórios faltando ou em formato inválido.",
                detail: `Nome: ${nome}, Categoria ID: ${categoriaId}, Valor: ${valor}, Imagem: ${!!imagemFile}`
            }, { status: 400 });
        }

        const productsToken = process.env.BLOB_PRODUCTS_READ_WRITE_TOKEN;

        if (!productsToken) {
            return NextResponse.json({
                error: "BLOB_PRODUCTS_READ_WRITE_TOKEN não está definido no ambiente."
            }, { status: 500 });
        }

        // ==============================
        // UPLOAD (AJUSTE NECESSÁRIO)
        // ==============================
        if (imagemFile && imagemFile.size > 0) {
            const blob = await put(
                `produto-${Date.now()}-${nome}`, // <<--- AQUI ESTÁ O AJUSTE
                imagemFile,
                {
                    access: 'public',
                    token: productsToken
                }
            );
            imageUrl = blob.url;
        }

        const result = await db.query(
            "INSERT INTO produtos (nome, categoria_id, valor, imagem, quantidade, desconto, em_promocao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nome, categoriaId, valor, imageUrl, quantidade, desconto, emPromocao]
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
