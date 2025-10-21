import db from "@/lib/db"; 
import { put } from "@vercel/blob";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';

        let query = `
            SELECT 
                *, 
                COALESCE(desconto, 0) as desconto, 
                COALESCE(em_promocao, false) as "emPromocao" 
            FROM produtos 
            WHERE 1=1
        `;
        const values = [];
        let paramIndex = 1;

        if (searchTerm) {
            // Se searchTerm é usado duas vezes na query, ele precisa ser passado 
            // no array de valores apenas UMA vez, mas o placeholder $n deve ser o mesmo.
            // Ex: ... (nome ILIKE $1 OR categoria ILIKE $1)
            query += ` AND (nome ILIKE $${paramIndex} OR categoria ILIKE $${paramIndex})`;
            values.push(`%${searchTerm}%`);
            paramIndex++;
        }

        if (category) {
            query += ` AND categoria = $${paramIndex}`;
            values.push(category);
            paramIndex++;
        }

        query += " ORDER BY id DESC"; 

        const result = await db.query(query, values);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Erro na busca de produtos (GET):", error);
        // Retorna o erro detalhado para ajudar no debug do frontend
        return NextResponse.json({ 
            message: 'Falha ao buscar produtos', 
            detail: error.message || 'Erro de servidor' 
        }, { status: 500 });
    }
}

export async function POST(req) {
    let imageUrl = null; // Variável para armazenar a URL do Blob
    
    try {
        // 1. ✅ CORREÇÃO: Lê os dados como FormData (Obrigatório para upload de arquivo)
        const formData = await req.formData();

        // 2. Extrai e converte os campos
        const nome = formData.get('nome');
        const categoria = formData.get('categoria');
        const valor = parseFloat(formData.get('valor'));
        const imagemFile = formData.get('imagem'); // Objeto File / Blob
        
        const quantidade = parseInt(formData.get('quantidade')) || 0; 
        const desconto = parseInt(formData.get('desconto')) || 0; 
        const emPromocao = formData.get('emPromocao') === 'true'; // Conversão de string para booleano

        // 3. Validação essencial
        if (!nome || !categoria || isNaN(valor) || !imagemFile) {
            return NextResponse.json({ 
                error: "Campos obrigatórios faltando ou em formato inválido.",
                detail: `Nome: ${nome}, Categoria: ${categoria}, Valor: ${valor}, Imagem: ${!!imagemFile}` 
            }, { status: 400 });
        }
        
        // 4. ✅ UPLOAD PARA VERCEL BLOB (DEVE VIR ANTES DO INSERT NO DB)
        // O put() precisa ser chamado com o objeto File, e o resultado é a URL que o DB precisa.
        if (imagemFile && imagemFile.size > 0) {
            // put(filename, blob, options)
            const blob = await put(nome, imagemFile, { access: 'public' });
            imageUrl = blob.url; // Armazena a URL pública
        }
        
        // 5. INSERÇÃO NO BANCO DE DADOS
        const result = await db.query(
            "INSERT INTO produtos (nome, categoria, valor, imagem, quantidade, desconto, em_promocao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nome, categoria, valor, imageUrl, quantidade, desconto, emPromocao] // Passa a imageUrl aqui
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        console.error("ERRO CRÍTICO ao adicionar produto (POST):", err.message || err); 

        return NextResponse.json({ 
            error: "Falha ao criar produto.", 
            detail: err.message || 'Erro de servidor'
        }, { status: 500 });
    }
}