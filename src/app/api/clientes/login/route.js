import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, senha } = body;

        if (!email || !senha) {
            return NextResponse.json(
                { message: "E-mail e senha são obrigatórios." },
                { status: 400 }
            );
        }

        const result = await db.query(
            "SELECT id, nome, email, telefone, senha_hash, status_ativo FROM clientes WHERE email = $1",
            [email]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: "E-mail ou senha inválidos." },
                { status: 401 }
            );
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(senha, user.senha_hash);

        if (!validPassword) {
            return NextResponse.json(
                { message: "E-mail ou senha inválidos." },
                { status: 401 }
            );
        }

        if (user.status_ativo === false) {
            return NextResponse.json(
                { message: "Sua conta está inativa." },
                { status: 403 }
            );
        }

        delete user.senha_hash;

        return NextResponse.json(
            { message: "Login realizado com sucesso!", user },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erro login clientes:", error);

        return NextResponse.json(
            { message: "Erro interno ao realizar login." },
            { status: 500 }
        );
    }
}
