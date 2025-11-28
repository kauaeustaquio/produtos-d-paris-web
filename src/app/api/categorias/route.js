import db from "@/lib/db";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// =======================================================
// POST → Criar nova categoria com upload de imagem
// =======================================================
export async function POST(req) {
    try {
        const formData = await req.formData();

        const nome = formData.get("nome");
        const imagemFile = formData.get("imagem");

        // Validação
        if (!nome || !imagemFile || imagemFile.size === 0) {
            return NextResponse.json(
                { error: "Nome e imagem da categoria são obrigatórios." },
                { status: 400 }
            );
        }

        // Token correto
        const categoriesToken = process.env.BLOB_CATEGORIES_READ_WRITE_TOKEN;
        if (!categoriesToken) {
            return NextResponse.json(
                { error: "Token de categorias não configurado no ambiente." },
                { status: 500 }
            );
        }

        // Upload no Vercel Blob
        const blob = await put(`categoria-${Date.now()}-${nome}`, imagemFile, {
            access: "public",
            token: categoriesToken,
        });

        const imageUrl = blob.url;

        // Inserção no banco
        const insert = await db.query(
            `
            INSERT INTO categorias (nome, imagem_url) 
            VALUES ($1, $2)
            RETURNING *
            `,
            [nome, imageUrl]
        );

        return NextResponse.json(insert.rows[0], { status: 201 });
    } catch (err) {
        console.error("ERRO ao criar categoria:", err);

        return NextResponse.json(
            {
                error: "Erro interno ao criar categoria.",
                detail: err.message || "Falha inesperada",
            },
            { status: 500 }
        );
    }
}

// =======================================================
// GET → Buscar categorias
// =======================================================
export async function GET() {
    try {
        const result = await db.query(
            "SELECT * FROM categorias ORDER BY nome ASC"
        );

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);

        return NextResponse.json(
            {
                message: "Falha ao buscar categorias.",
                detail: error.message,
            },
            { status: 500 }
        );
    }
}
