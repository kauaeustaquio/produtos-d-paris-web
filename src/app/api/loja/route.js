// app/api/loja/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Localiza o arquivo de configuração da loja
const configPath = path.join(process.cwd(), 'config', 'store_info.json');

export async function GET() {
  try {
    // Lê o conteúdo do arquivo JSON
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);
    
    // Retorna os dados da loja
    return NextResponse.json(config);
  } catch (error) {
    console.error("Erro ao ler os dados da loja:", error);
    // Retorna a logo padrão caso falhe
    return NextResponse.json({ 
        logo_url: "/img/logo-loja-info.png", 
        aboutText: "Erro ao carregar os dados da loja.",
        location: {},
        contact: {}
    }, { status: 500 });
  }
}