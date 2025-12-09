import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const body = await request.json();
        const { nome, email, telefone, senha } = body;

        if (!nome || !email || !telefone || !senha) {
            return NextResponse.json(
                { message: "Nome, telefone, e-mail e senha são obrigatórios." },
                { status: 400 }
            );
        }

        const checkEmail = await db.query(
            "SELECT id FROM clientes WHERE email = $1",
            [email]
        );

        if (checkEmail.rowCount > 0) {
            return NextResponse.json(
                { message: "Este e-mail já está cadastrado." },
                { status: 409 }
            );
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const result = await db.query(
            `INSERT INTO clientes (nome, email, telefone, senha_hash, status_ativo)
             VALUES ($1, $2, $3, $4, TRUE)
             RETURNING id, nome, email, telefone, status_ativo`,
            [nome, email, telefone, senhaHash]
        );

        return NextResponse.json(
            { message: "Cliente cadastrado com sucesso!", cliente: result.rows[0] },
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro signup clientes:", error);

        return NextResponse.json(
            { message: "Erro interno ao cadastrar cliente." },
            { status: 500 }
        );
    }
}
