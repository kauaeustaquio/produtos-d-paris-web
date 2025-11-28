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
        // O parâmetro 'category' agora deve receber o NOME ou ID da categoria. 
        // Vamos usá-lo para filtrar pelo NOME da categoria na tabela 'categorias'.
        const categoryFilter = searchParams.get('category') || '';

        // 1. Query com JOIN para obter nome e ID da categoria
        let query = `
            SELECT 
                p.*, 
                c.nome AS nome_categoria,           -- Nome da categoria
                c.id AS categoria_id,               -- ID da categoria
                c.imagem_url AS imagem_categoria,   -- Imagem da categoria (opcional)
                COALESCE(p.desconto, 0) as desconto, 
                COALESCE(p.em_promocao, false) as "emPromocao" 
            FROM produtos p
            JOIN categorias c ON p.categoria_id = c.id   -- <--- NOVO JOIN
            WHERE 1=1
        `;
        const values = [];
        let paramIndex = 1;

        if (searchTerm) {
            // 2. Busca agora em 'p.nome' ou 'c.nome'
            query += ` AND (p.nome ILIKE $${paramIndex} OR c.nome ILIKE $${paramIndex})`;
            values.push(`%${searchTerm}%`);
            paramIndex++;
        }

        if (categoryFilter) {
            // 3. Filtra pelo nome da categoria (ou você pode mudar para filtrar por c.id se o frontend enviar o ID)
            query += ` AND c.nome = $${paramIndex}`;
            values.push(categoryFilter);
            paramIndex++;
        }

        query += " ORDER BY p.id DESC"; // Ordena pelo ID do produto (p.id)

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
// Rota POST: Criar Produto (usando categoria_id e Blob Token específico)
// =======================================================
export async function POST(req) {
    let imageUrl = null; 
    
    try {
        const formData = await req.formData();

        // 1. Extrai e converte os campos
        const nome = formData.get('nome');
        // Espera-se o ID da categoria, não o nome. Converte para inteiro.
        const categoriaId = parseInt(formData.get('categoriaId')); // <--- MUDANÇA
        const valor = parseFloat(formData.get('valor'));
        const imagemFile = formData.get('imagem'); 
        
        const quantidade = parseInt(formData.get('quantidade')) || 0; 
        const desconto = parseInt(formData.get('desconto')) || 0; 
        const emPromocao = formData.get('emPromocao') === 'true'; 

        // 2. Validação essencial (checa se o ID é um número)
        if (!nome || isNaN(categoriaId) || isNaN(valor) || !imagemFile) {
            return NextResponse.json({ 
                error: "Campos obrigatórios faltando ou em formato inválido.",
                detail: `Nome: ${nome}, Categoria ID: ${categoriaId}, Valor: ${valor}, Imagem: ${!!imagemFile}` 
            }, { status: 400 });
        }
        
        // 3. Obtém o Token de Acesso ESPECÍFICO para Produtos
        const productsToken = process.env.BLOB_PRODUCTS_READ_WRITE_TOKEN;
        
        if (!productsToken) {
             return NextResponse.json({ 
                error: "BLOB_PRODUCTS_READ_WRITE_TOKEN não está definido no ambiente." 
            }, { status: 500 });
        }
        
        // 4. UPLOAD PARA VERCEL BLOB (STORE DE PRODUTOS)
        if (imagemFile && imagemFile.size > 0) {
            const blob = await put(nome, imagemFile, { 
                access: 'public',
                token: productsToken // <--- CHAVE ESPECÍFICA INSERIDA AQUI
            });
            imageUrl = blob.url; // Armazena a URL pública
        }
        
        // 5. INSERÇÃO NO BANCO DE DADOS (usando categoria_id)
        const result = await db.query(
            "INSERT INTO produtos (nome, categoria_id, valor, imagem, quantidade, desconto, em_promocao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nome, categoriaId, valor, imageUrl, quantidade, desconto, emPromocao] // <--- Passa categoriaId
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