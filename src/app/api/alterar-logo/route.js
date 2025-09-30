import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
// 🚨 Importe as novas funções que interagem com o PostgreSQL
import { getLogoUrlFromDB, updateLogoUrlInDB } from '../../../lib/db'; 


// O caminho para a pasta de uploads no diretório 'public'
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Handler GET para retornar a URL atual da logo (do DB)
export async function GET() {
    try {
        // Busca a URL diretamente do PostgreSQL
        const logoUrl = await getLogoUrlFromDB(); 
        // Se a busca falhar ou retornar nulo, usamos o padrão.
        return NextResponse.json({ logoUrl: logoUrl || '/img/logo-loja-info.png' });
    } catch (error) {
        console.error("Erro ao buscar a logo no DB:", error);
        return NextResponse.json({ logoUrl: '/img/logo-loja-info.png' });
    }
}

// Handler POST para receber a nova logo, salvar o arquivo e atualizar o DB
export async function POST(request) {
    try {
        // 1. Pega a URL da logo antiga (do DB)
        const oldLogoUrl = await getLogoUrlFromDB(); 

        // 2. Cria a pasta de uploads se ela não existir
        await fs.mkdir(uploadDir, { recursive: true });

        // 3. Pega o arquivo do FormData
        const formData = await request.formData();
        const file = formData.get('logo');

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo encontrado' }, { status: 400 });
        }

        // 4. Salva o novo arquivo
        const buffer = Buffer.from(await file.arrayBuffer());
        const newFileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, newFileName);
        await fs.writeFile(filePath, buffer);

        // 5. Exclui o arquivo antigo (se não for a logo padrão)
        // Isso é crucial para liberar espaço no servidor!
        if (oldLogoUrl && oldLogoUrl !== '/img/logo-loja-info.png') {
            const oldFilePath = path.join(process.cwd(), 'public', oldLogoUrl);
            try {
                // Remove o arquivo antigo (ex: /public/uploads/logo-antiga.png)
                await fs.unlink(oldFilePath); 
            } catch (unlinkError) {
                console.error('Não foi possível apagar a imagem antiga:', unlinkError);
                // Continua o processo, pois o erro é na exclusão, não no upload
            }
        }

        // 6. Atualiza o PostgreSQL com a nova URL
        const newLogoUrl = `/uploads/${newFileName}`;
        await updateLogoUrlInDB(newLogoUrl); // <--- A MUDANÇA PRINCIPAL AQUI!

        return NextResponse.json({ logoUrl: newLogoUrl });

    } catch (error) {
        console.error('Erro no upload ou DB:', error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}