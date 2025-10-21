import db from "@/lib/db";
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// =========================================================================
// FUNÇÃO GET: Busca (Listagem) de Clientes COM FILTRO DE STATUS
// =========================================================================
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const statusFilter = searchParams.get('status'); // 'ativo', 'inativo', ou null/undefined

        // 1. Inclua a nova coluna status_ativo no SELECT
        let query = "SELECT id, nome, telefone, email, status_ativo FROM clientes";
        let params = [];
        let conditions = [];

        // 2. ADICIONA CONDIÇÃO DE PESQUISA (Search Term)
        if (searchTerm) {
            // Usamos ILIKE para case-insensitive search (comum em PostgreSQL)
            conditions.push(`(nome ILIKE $${conditions.length + 1} OR telefone ILIKE $${conditions.length + 1} OR email ILIKE $${conditions.length + 1})`);
            params.push(`%${searchTerm}%`);
        }

        // 3. ADICIONA CONDIÇÃO DE FILTRO DE STATUS
        if (statusFilter === 'ativo') {
            // O PostgreSQL usa TRUE/FALSE diretamente no WHERE para BOOLEAN
            conditions.push(`status_ativo = TRUE`);
        } else if (statusFilter === 'inativo') {
            conditions.push(`status_ativo = FALSE`);
        }
        // Se statusFilter for null, undefined, ou 'todos', nenhuma condição é adicionada.

        // 4. CONSTRÓI A CLÁUSULA WHERE
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        // 5. Adiciona ordenação
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


// =========================================================================
// FUNÇÃO POST: Cadastro de Clientes (Sem modificações relevantes para o status)
// =========================================================================
export async function POST(request) {
    try {
        // 1. RECEBIMENTO DE DADOS: Pega 'senha_hash' do body JSON e renomeia para 'senha' (texto puro)
        const body = await request.json();
        // Incluindo status_ativo, mas no POST ele quase sempre será TRUE por padrão
        const { nome, email, telefone, senha_hash: senha } = body; 
        
        console.log("Dados recebidos no Servidor:", { nome, email, senha, telefone }); 

        // 2. Validação básica
        if (!nome || !email || !senha || !telefone) {
            console.error("Erro 400: Campos ausentes.", { nome: !!nome, email: !!email, senha: !!senha, telefone: !!telefone });
            return NextResponse.json({ message: "Nome, e-mail, senha e telefone são obrigatórios." }, { status: 400 });
        }
        
        // 3. Verifica se o cliente já existe pelo e-mail
        const existingClient = await db.query("SELECT id FROM clientes WHERE email = $1", [email]);
        if (existingClient.rowCount > 0) {
            return NextResponse.json({ message: "Este e-mail já está cadastrado para um cliente." }, { status: 409 }); 
        }
        
        // 4. Hash da Senha (Segurança)
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // 5. Inserção no Banco de Dados: O campo status_ativo usará o DEFAULT TRUE definido na sua tabela.
        const result = await db.query(
            // Colunas: (nome, email, telefone, senha_hash)
            "INSERT INTO clientes (nome, email, telefone, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone, status_ativo",
            // Parâmetros: $1, $2, $3, $4
            [nome, email, telefone, senhaHash] // O valor da hash é o ÚLTIMO parâmetro.
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