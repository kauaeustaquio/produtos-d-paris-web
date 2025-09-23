// app/api/loja/texto/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'store_info.json');

export async function POST(request) {
  try {
    const { field, value } = await request.json();

    if (!field || !value) {
      return NextResponse.json({ error: 'Campos inválidos' }, { status: 400 });
    }

    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);

    // Lógica para atualizar o campo correto
    if (field === 'aboutText') {
      config.aboutText = value;
    } else if (field === 'location') {
      config.location = JSON.parse(value);
    } else if (field === 'contact') {
      config.contact = JSON.parse(value);
    } else {
      return NextResponse.json({ error: 'Campo desconhecido' }, { status: 400 });
    }

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    return NextResponse.json({ success: true, value: config[field] });
  } catch (error) {
    console.error('Erro ao salvar o texto:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}