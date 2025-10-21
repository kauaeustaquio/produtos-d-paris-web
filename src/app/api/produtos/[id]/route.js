// Arquivo: src/app/api/produtos/[id]/route.js

import { NextResponse } from 'next/server';
import db from "@/lib/db";
import { put } from "@vercel/blob"; 

// ==========================================================
// FUNÇÃO PUT (Atualiza o produto, a que você forneceu)
// ==========================================================
export async function PUT(req, { params }) {
    let imageUrl = null;
    
    try {
        const id = params.id; 
        const formData = await req.formData();
        
        const nome = formData.get('nome');
        const categoria = formData.get('categoria');
        const valor = parseFloat(formData.get('valor'));
        const imagemFile = formData.get('imagem');
        const desconto = parseInt(formData.get('desconto')) || 0; 
        const emPromocao = formData.get('emPromocao') === 'true'; 

        if (!id || !nome || !categoria || isNaN(valor)) {
            return NextResponse.json({ error: "ID ou campos obrigatórios faltando ou em formato inválido." }, { status: 400 });
        }

        // Lógica de Imagem
        if (imagemFile && typeof imagemFile !== 'string') {
            if (imagemFile.size > 0) {
                 const blob = await put(nome, imagemFile, { access: 'public' });
                 imageUrl = blob.url;
            }
        } else if (typeof imagemFile === 'string') {
            imageUrl = imagemFile;
        }

        if (imageUrl === null) {
            imageUrl = formData.get('imagem') || null; 
        }

        // Execução da Query UPDATE
        const result = await db.query(
            `UPDATE produtos 
             SET nome = $1, categoria = $2, valor = $3, imagem = $4, desconto = $5, em_promocao = $6
             WHERE id = $7 RETURNING *`, 
            [nome, categoria, valor, imageUrl, desconto, emPromocao, id] 
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para atualização." }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 }); 

    } catch (err) {
        console.error("ERRO CRÍTICO no PUT (Atualização):", err.message || err); 
        return NextResponse.json({ 
            message: "Falha na atualização do produto.", 
            detail: err.message || 'Erro de servidor'
        }, { status: 500 });
    }
}


// ==========================================================
// FUNÇÃO DELETE (Obrigatória para resolver o erro 405)
// ==========================================================
export async function DELETE(request, { params }) {
    try {
        // Extrai o ID
        const id = params.id; 

        if (!id) {
            return NextResponse.json({ message: "ID do produto não fornecido." }, { status: 400 });
        }

        const result = await db.query("DELETE FROM produtos WHERE id = $1 RETURNING id", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para exclusão." }, { status: 404 });
        }

        // 204 No Content é o padrão para DELETE bem-sucedido.
        return new NextResponse(null, { status: 204 }); 

    } catch (error) {
        console.error("ERRO CRÍTICO no DELETE (BD):", error.message || error); 
        return NextResponse.json({ 
            message: 'Falha ao deletar produto.',
            detail: error.message || 'Erro de servidor'
        }, { status: 500 });
    }
}

// Opcional: Adicione a função GET para buscar um único produto
// export async function GET(request, { params }) { /* ... */ }