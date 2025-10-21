// Exemplo conceitual da ROTA PUT (app/api/clientes/[id]/status/route.js)
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    const { id } = params;
    const { is_active } = await request.json(); // Pega o novo status (true/false)

    try {
        const result = await db.query(
            "UPDATE clientes SET status_ativo = $1 WHERE id = $2 RETURNING id, status_ativo",
            [is_active, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Cliente não encontrado.' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}