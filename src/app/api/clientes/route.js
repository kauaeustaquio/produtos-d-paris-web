import db from "@/lib/db";
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';


//STATUS: 'ativo', 'inativo', ou null/undefined

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const statusFilter = searchParams.get('status'); 

        let query = "SELECT id, nome, telefone, email, status_ativo FROM clientes";
        let params = [];
        let conditions = [];

        if (searchTerm) {

            conditions.push(`(nome ILIKE $${conditions.length + 1} OR telefone ILIKE $${conditions.length + 1} OR email ILIKE $${conditions.length + 1})`);
            params.push(`%${searchTerm}%`);
        }

        if (statusFilter === 'ativo') {
            
            conditions.push(`status_ativo = TRUE`);
        } else if (statusFilter === 'inativo') {
            conditions.push(`status_ativo = FALSE`);
        }
    
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY nome ASC";

        let result = await db.query(query, params);

        return NextResponse.json(result.rows);

    } catch (error) {
        console.error("Erro fatal na busca de clientes (GET):", error);

        return NextResponse.json({
            message: 'Falha interna ao buscar clientes. Verifique o console do servidor.'
        }, { status: 500 });
    }
}



//POST: Cadastro 

export async function POST(request) {
    try {
        const body = await request.json();
    
        const { nome, email, telefone, senha_hash: senha } = body; 
        
        console.log("Dados recebidos no Servidor:", { nome, email, senha, telefone }); 

        //Validação
        if (!nome || !email || !senha || !telefone) {
            console.error("Erro 400: Campos ausentes.", { nome: !!nome, email: !!email, senha: !!senha, telefone: !!telefone });
            return NextResponse.json({ message: "Nome, e-mail, senha e telefone são obrigatórios." }, { status: 400 });
        }
        
        //Cliente já existe pelo e-mail
        const existingClient = await db.query("SELECT id FROM clientes WHERE email = $1", [email]);
        if (existingClient.rowCount > 0) {
            return NextResponse.json({ message: "Este e-mail já está cadastrado para um cliente." }, { status: 409 }); 
        }
        
        //Hash 
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const result = await db.query(
            //(nome, email, telefone, senha_hash)
            "INSERT INTO clientes (nome, email, telefone, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone, status_ativo",
            //parâmetros: $1, $2, $3, $4
            [nome, email, telefone, senhaHash] 
        );

        return NextResponse.json({ 
            message: "Cliente cadastrado com sucesso!", 
            cliente: result.rows[0] 
        }, { status: 201 });

    } catch (error) {
        console.error("Erro no cadastro de cliente (POST):", error);
        
        return NextResponse.json({ 
            message: 'Falha interna ao cadastrar cliente. Verifique a conexão e credenciais do DB.' 
        }, { status: 500 });
    }
}