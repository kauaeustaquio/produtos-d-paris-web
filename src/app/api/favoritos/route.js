import db from "@/lib/db";
import { NextResponse } from "next/server";

// ===========================================
// POST → Adicionar favorito e retornar produto completo
// ===========================================
export async function POST(req) {
    try {
        const body = await req.json();
        const { cliente_id, produto_id } = body;

        if (!cliente_id || !produto_id) {
            return NextResponse.json(
                { error: "cliente_id e produto_id são obrigatórios." },
                { status: 400 }
            );
        }

        // Verificar se o cliente existe
        const cliente = await db.query("SELECT id FROM clientes WHERE id = $1", [cliente_id]);
        if (cliente.rows.length === 0) {
            return NextResponse.json({ error: "Cliente não existe." }, { status: 400 });
        }

        // Verificar se o produto existe
        const produto = await db.query("SELECT * FROM produtos WHERE id = $1", [produto_id]);
        if (produto.rows.length === 0) {
            return NextResponse.json({ error: "Produto não existe." }, { status: 400 });
        }

        // Inserir favorito (evita duplicados) e retornar favorito_id
        const insert = await db.query(
            `INSERT INTO favoritos (cliente_id, produto_id)
             VALUES ($1, $2)
             ON CONFLICT (cliente_id, produto_id) DO NOTHING
             RETURNING id AS favorito_id`,
            [cliente_id, produto_id]
        );

        const favorito_id = insert.rows[0]?.favorito_id || null;
        const produtoCompleto = produto.rows[0];

        return NextResponse.json({
            favorito_id,
            ...produtoCompleto
        }, { status: 201 });

    } catch (error) {
        console.error("Erro ao favoritar:", error);
        return NextResponse.json({ error: "Erro interno.", detail: error.message }, { status: 500 });
    }
}

// ===========================================
// GET → Buscar favoritos de um cliente
// ?cliente_id=1
// ===========================================
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cliente_id = searchParams.get("cliente_id");

        if (!cliente_id) {
            return NextResponse.json({ error: "cliente_id é obrigatório." }, { status: 400 });
        }

        // Retorna produto completo + favorito_id
        const result = await db.query(
            `SELECT f.id AS favorito_id, p.*
             FROM favoritos f
             INNER JOIN produtos p ON p.id = f.produto_id
             WHERE f.cliente_id = $1`,
            [cliente_id]
        );

        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        return NextResponse.json({ error: "Erro interno.", detail: error.message }, { status: 500 });
    }
}

// ===========================================
// DELETE → Remover favorito pelo favorito_id
// ===========================================
export async function DELETE(req, { params }) {
    try {
        const favorito_id = params.id;

        if (!favorito_id) {
            return NextResponse.json({ error: "ID do favorito é obrigatório." }, { status: 400 });
        }

        await db.query("DELETE FROM favoritos WHERE id = $1", [favorito_id]);

        return NextResponse.json({ message: "Favorito removido com sucesso." }, { status: 200 });

    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        return NextResponse.json({ error: "Erro interno ao remover favorito.", detail: error.message }, { status: 500 });
    }
}
