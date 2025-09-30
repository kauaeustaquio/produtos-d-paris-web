// Arquivo: app/api/produtos/[id]/route.js

import { NextResponse } from 'next/server';
import db from "@/lib/db";

// Rota DELETE: Exclusão de Produto
export async function DELETE(request, { params }) {
    try {
        const { id } = params; // Captura o ID da URL

        if (!id) {
            return NextResponse.json({ message: "ID do produto não fornecido." }, { status: 400 });
        }

        const result = await db.query("DELETE FROM produtos WHERE id = $1 RETURNING id", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para exclusão." }, { status: 404 });
        }

        return NextResponse.json({ message: "Produto deletado com sucesso." }, { status: 200 }); 

    } catch (error) {
        console.error("ERRO CRÍTICO no DELETE (BD):", error.message || error); 
        return NextResponse.json({ 
            message: 'Falha ao deletar produto.',
            detail: error.message || 'Erro de servidor'
        }, { status: 500 });
    }
}

// Rota PUT: Atualização/Edição de Produto (SEM QUANTIDADE)
export async function PUT(req, { params }) {
    try {
        const { id } = params; 
        const data = await req.json();
        
        // APENAS campos que serão atualizados no BD
        const { nome, categoria, valor, imagem } = data; 
        
        if (!id || !nome || !categoria || valor === undefined) {
            return NextResponse.json({ error: "ID ou campos obrigatórios faltando" }, { status: 400 });
        }
        
        // QUERY CORRIGIDA: Não referencia 'quantidade'
        const result = await db.query(
            `UPDATE produtos 
             SET nome = $1, categoria = $2, valor = $3, imagem = $4
             WHERE id = $5 RETURNING id`, // ID agora é $5
            [nome, categoria, valor, imagem, id] // Valores ajustados
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para atualização." }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Produto atualizado com sucesso" }, { status: 200 });

    } catch (err) {
        // TRATAMENTO DE ERRO: Garante que a mensagem chegue ao frontend
        console.error("ERRO CRÍTICO no PUT (BD):", err.message || err); 
        
        return NextResponse.json({ 
            message: "Falha na atualização do banco de dados.", 
            detail: err.message || 'Erro de servidor'
        }, { status: 500 });
    }
}