import db from "@/lib/db"; 
import { put } from "@vercel/blob";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';

        let query = "SELECT *, COALESCE(desconto, 0) as desconto, COALESCE(em_promocao, false) as \"emPromocao\" FROM produtos WHERE 1=1";
        const values = [];
        let paramIndex = 1;

        if (searchTerm) {
            query += ` AND (nome ILIKE $${paramIndex} OR categoria ILIKE $${paramIndex})`;
            values.push(`%${searchTerm}%`);
            paramIndex++;
        }

        if (category) {
            query += ` AND categoria = $${paramIndex}`;
            values.push(category);
            paramIndex++;
        }

        query += " ORDER BY id DESC"; 

        const result = await db.query(query, values);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Erro na busca de produtos (GET):", error);
        return NextResponse.json({ message: 'Falha ao buscar produtos', detail: error.message || 'Erro de servidor' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.json();

        let { nome, categoria, valor, imagem, quantidade, desconto, emPromocao } = data; 

        valor = parseFloat(valor);
        quantidade = parseInt(quantidade) || 0;
        desconto = parseInt(desconto) || 0; 
        emPromocao = Boolean(emPromocao); 

        if (!nome || !categoria || isNaN(valor) || valor === undefined) {
            return NextResponse.json({ error: "Campos obrigatórios faltando ou em formato inválido." }, { status: 400 });
        }

        const result = await db.query(
            "INSERT INTO produtos (nome, categoria, valor, imagem, quantidade, desconto, em_promocao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nome, categoria, valor, imagem, quantidade, desconto, emPromocao]
        );

        const blob = await put(nome, imagem, {access: 'public'});

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        console.error("ERRO CRÍTICO ao adicionar produto (POST):", err.message || err); 

        return NextResponse.json({ 
            error: "Falha ao criar produto.", 
            detail: err.message || 'Erro de servidor'
        }, { status: 500 });
    }
}