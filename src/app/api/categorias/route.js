import db from "@/lib/db";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// =======================================================
// POST → Criar nova categoria (imagem opcional)
// =======================================================
export async function POST(req) {
    try {
        const formData = await req.formData();
        const nome = formData.get("nome");
        const imagemFile = formData.get("imagem");

        // Validação: nome obrigatório
        if (!nome) {
            return NextResponse.json({ error: "O nome da categoria é obrigatório." }, { status: 400 });
        }

        // Evitar nome duplicado
        const existente = await db.query("SELECT id FROM categorias WHERE nome = $1", [nome]);
        if (existente.rows.length > 0) {
            return NextResponse.json({ error: "Já existe uma categoria com esse nome." }, { status: 400 });
        }

        let imageUrl = null;

        // Upload de imagem (opcional)
        if (imagemFile && imagemFile.size > 0) {
            const categoriesToken = process.env.BLOB_CATEGORIES_READ_WRITE_TOKEN;
            if (!categoriesToken) {
                return NextResponse.json({ error: "Token de categorias não configurado." }, { status: 500 });
            }

            const blob = await put(`categoria-${Date.now()}-${nome}`, imagemFile, {
                access: "public",
                token: categoriesToken,
            });

            imageUrl = blob.url;
        }

        // Inserir categoria no banco
        const insert = await db.query(
            "INSERT INTO categorias (nome, imagem_url) VALUES ($1, $2) RETURNING *",
            [nome, imageUrl]
        );

        return NextResponse.json(insert.rows[0], { status: 201 });

    } catch (err) {
        console.error("Erro ao criar categoria:", err);
        return NextResponse.json({ error: "Erro interno ao criar categoria.", detail: err.message || "Falha inesperada" }, { status: 500 });
    }
}

// =======================================================
// GET → Buscar categorias
// =======================================================
export async function GET() {
    try {
        const result = await db.query("SELECT * FROM categorias ORDER BY nome ASC");
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return NextResponse.json({ message: "Falha ao buscar categorias.", detail: error.message }, { status: 500 });
    }
}

// =======================================================
// DELETE → Remover categoria
// =======================================================
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID da categoria é obrigatório." }, { status: 400 });
        }

        // ❗ Verificar se existe produto usando a categoria (LIMIT 1 para performance)
        const produtos = await db.query(
            "SELECT 1 FROM produtos WHERE categoria_id = $1 LIMIT 1",
            [id]
        );

        if (produtos.rows.length > 0) {
            return NextResponse.json(
                { error: "Não é possível remover a categoria porque existem produtos associados." },
                { status: 400 }
            );
        }

        // Remover categoria
        await db.query("DELETE FROM categorias WHERE id = $1", [id]);

        return NextResponse.json({ message: "Categoria removida com sucesso." }, { status: 200 });

    } catch (error) {
        console.error("Erro ao remover categoria:", error);
        return NextResponse.json({ error: "Erro interno ao remover categoria.", detail: error.message }, { status: 500 });
    }
}
