import { NextResponse } from 'next/server';
import db from "@/lib/db";
import { put } from "@vercel/blob"; 

// ==========================================================
// FUNÇÃO PUT (Atualiza o produto, usando categoria_id)
// ==========================================================
export async function PUT(req, context) {
    let imageUrl = null;
    
    try {
        const { params } = await context; // ✅ Aguardando params
        const id = params.id; 
        const formData = await req.formData();
        
        const nome = formData.get('nome');
        const categoriaId = parseInt(formData.get('categoriaId'));
        const valor = parseFloat(formData.get('valor'));
        const imagemFile = formData.get('imagem');
        const desconto = parseInt(formData.get('desconto')) || 0; 
        const emPromocao = formData.get('emPromocao') === 'true'; 

        if (!id || !nome || isNaN(categoriaId) || isNaN(valor)) {
            return NextResponse.json({ 
                error: "ID do produto, Categoria ID ou campos obrigatórios faltando ou em formato inválido." 
            }, { status: 400 });
        }

        const productsToken = process.env.BLOB_PRODUCTS_READ_WRITE_TOKEN;
        if (!productsToken) {
            return NextResponse.json({ 
                error: "BLOB_PRODUCTS_READ_WRITE_TOKEN não está definido no ambiente." 
            }, { status: 500 });
        }

        if (imagemFile && typeof imagemFile !== 'string' && imagemFile.size > 0) {
            const blob = await put(
                `produto-${Date.now()}-${nome}`, 
                imagemFile,
                { access: 'public', token: productsToken }
            );
            imageUrl = blob.url;
        } else if (typeof imagemFile === 'string') {
            imageUrl = imagemFile; // mantém URL existente
        } else {
            imageUrl = formData.get('imagem') || null;
        }

        const result = await db.query(
            `UPDATE produtos 
             SET nome = $1, categoria_id = $2, valor = $3, imagem = $4, desconto = $5, em_promocao = $6
             WHERE id = $7 RETURNING *`, 
            [nome, categoriaId, valor, imageUrl, desconto, emPromocao, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para atualização." }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 }); 

    } catch (err) {
        console.error("ERRO CRÍTICO no PUT (Atualização):", err.message || err); 
        return NextResponse.json({ 
            message: "Falha na atualização do produto.", 
            detail: err.message || 'Erro de servidor'
        }, { status: 500 });
    }
}


// ==========================================================
// FUNÇÃO DELETE 
// ==========================================================
export async function DELETE(request, context) {
    try {
        const { params } = await context; // ✅ Aguardando params
        const id = params.id; 

        if (!id) {
            return NextResponse.json({ message: "ID do produto não fornecido." }, { status: 400 });
        }

        const result = await db.query(
            "DELETE FROM produtos WHERE id = $1 RETURNING id", 
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Produto não encontrado para exclusão." }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 }); 

    } catch (error) {
        console.error("ERRO CRÍTICO no DELETE (BD):", error.message || error); 
        return NextResponse.json({ 
            message: 'Falha ao deletar produto.',
            detail: error.message || 'Erro de servidor'
        }, { status: 500 });
    }
}
