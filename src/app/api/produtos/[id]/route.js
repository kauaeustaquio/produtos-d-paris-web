import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "ID do produto não fornecido." }, { status: 400 });
        }

        const result = await db.query("DELETE FROM produtos WHERE id = $1 RETURNING id", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
        }

        return NextResponse.json({ message: "Produto deletado com sucesso." }, { status: 200 });

    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        return NextResponse.json({ message: 'Falha ao deletar produto' }, { status: 500 });
    }
}