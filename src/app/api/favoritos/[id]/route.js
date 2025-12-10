import { NextResponse } from "next/server";
import db from "@/lib/db";

// =======================================================
// DELETE → Remover favorito pelo ID
// =======================================================
export async function DELETE(req, { params }) {
    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json(
                { error: "ID do favorito é obrigatório." },
                { status: 400 }
            );
        }

        await db.query("DELETE FROM favoritos WHERE id = $1", [id]);

        return NextResponse.json(
            { message: "Favorito removido com sucesso." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        return NextResponse.json(
            { error: "Erro interno ao remover favorito.", detail: error.message },
            { status: 500 }
        );
    }
}
