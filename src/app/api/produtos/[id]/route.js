import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const result = await db.query(

            "SELECT *, COALESCE(desconto, 0) as desconto, COALESCE(em_promocao, false) as \"emPromocao\" FROM produtos WHERE id = $1", 
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Erro na busca de produto por ID (GET):", error);
        return NextResponse.json({ message: 'Falha ao buscar produto', detail: error.message || 'Erro de servidor' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = params; 
        const data = await req.json();

        let { nome, categoria, valor, imagem, desconto, emPromocao } = data; 

        if (!id || !nome || !categoria || valor === undefined) {
            return NextResponse.json({ error: "ID ou campos obrigatórios faltando" }, { status: 400 });
        }

        desconto = parseInt(desconto) || 0; 
        emPromocao = Boolean(emPromocao); 
        valor = parseFloat(valor); 

        const result = await db.query(
            `UPDATE produtos 
             SET nome = $1, categoria = $2, valor = $3, imagem = $4, desconto = $5, em_promocao = $6
             WHERE id = $7 RETURNING *`, 

            [nome, categoria, valor, imagem, desconto, emPromocao, id] 
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para atualização." }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 }); 

    } catch (err) {
        console.error("ERRO CRÍTICO no PUT (BD):", err.message || err); 

        return NextResponse.json({ 
            message: "Falha na atualização do banco de dados.", 
            detail: err.message || 'Erro de servidor'
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params; 

        if (!id) {
            return NextResponse.json({ message: "ID do produto não fornecido." }, { status: 400 });
        }

        const result = await db.query("DELETE FROM produtos WHERE id = $1 RETURNING id", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para exclusão." }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 }); 

    } catch (error) {
        console.error("ERRO CRÍTICO no DELETE (BD):", error.message || error); 
        return NextResponse.json({ 
            message: 'Falha ao deletar produto.',
            detail: error.message || 'Erro de servidor'
        }, { status: 500 });
    }
}