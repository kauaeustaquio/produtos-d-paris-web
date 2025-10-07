import db from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // 1. Pega os parâmetros de busca da URL
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';

        // Tabela confirmada como 'clientes' (plural)
        let query = "SELECT id, nome, telefone, email FROM clientes"; 
        let params = [];
        
        // 2. Adiciona a cláusula WHERE se houver um termo de busca
        if (searchTerm) {
            query += " WHERE nome ILIKE $1 OR telefone ILIKE $1 OR email ILIKE $1";
            params.push(`%${searchTerm}%`);
        }

        query += " ORDER BY nome ASC";

        // 3. Executa a consulta
        let result;
        try {
            // Se falhar aqui, o problema é 100% o arquivo db, a variável de ambiente ou as credenciais.
            result = await db.query(query, params);
        } catch (dbError) {
            console.error("--- ERRO NA EXECUÇÃO DO DB (PROVAVELMENTE CONEXÃO OU CREDENCIAL) ---");
            console.error("Detalhes do erro do banco:", dbError.message);
            throw dbError; 
        }
        
        // 4. Retorna os resultados
        return NextResponse.json(result.rows);
        
    } catch (error) {
        console.error("Erro fatal na busca de clientes:", error);
        
        return NextResponse.json({ 
            message: 'Falha interna ao buscar clientes. Verifique o console do servidor para detalhes do DB.' 
        }, { status: 500 });
    }
}