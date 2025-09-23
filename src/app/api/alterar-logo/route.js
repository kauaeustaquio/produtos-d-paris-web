import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// O caminho para o arquivo de configuração e para a pasta de uploads
const configPath = path.join(process.cwd(), 'config', 'store_info.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Função para ler a URL da logo do arquivo de configuração
async function readLogoUrl() {
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);
    return config.logoUrl;
  } catch (error) {
    // Retorna a URL padrão se o arquivo não existir ou houver um erro
    return '/img/logo-loja-info.png';
  }
}

// Handler GET para retornar a URL atual da logo
export async function GET() {
  const logoUrl = await readLogoUrl();
  return NextResponse.json({ logoUrl });
}

// Handler POST para receber a nova logo e salvá-la
export async function POST(request) {
  try {
    // 1. Pega a URL da logo antiga
    const oldLogoUrl = await readLogoUrl();

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
    if (oldLogoUrl && oldLogoUrl !== '/img/logo-loja-info.png') {
        const oldFilePath = path.join(process.cwd(), 'public', oldLogoUrl);
        try {
            await fs.unlink(oldFilePath);
        } catch (unlinkError) {
            console.error('Não foi possível apagar a imagem antiga:', unlinkError);
        }
    }

    // 6. Atualiza o arquivo de configuração com a nova URL
    const newLogoUrl = `/uploads/${newFileName}`;
    const newConfig = { logoUrl: newLogoUrl };
    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2));

    return NextResponse.json({ logoUrl: newLogoUrl });

  } catch (error) {
    console.error('Erro no upload da logo:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}