import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET - LISTAR CLIENTES
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search") || "";
        const statusFilter = searchParams.get("status");

        let query = `
            SELECT id, nome, telefone, email, status_ativo
            FROM clientes
        `;

        const params = [];
        const conditions = [];

        // Busca geral
        if (search.trim() !== "") {
            params.push(`%${search}%`);
            conditions.push(`
                (nome ILIKE $${params.length}
                OR telefone ILIKE $${params.length}
                OR email ILIKE $${params.length})
            `);
        }

        // Filtro por status
        if (statusFilter === "ativo") {
            conditions.push("status_ativo = TRUE");
        } else if (statusFilter === "inativo") {
            conditions.push("status_ativo = FALSE");
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY nome ASC";

        const result = await db.query(query, params);
        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error("Erro GET clientes:", error);

        return NextResponse.json(
            { message: "Erro interno ao buscar clientes." },
            { status: 500 }
        );
    }
}
