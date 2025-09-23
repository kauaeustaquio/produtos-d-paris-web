// app/api/loja/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'store_info.json');

export async function GET() {
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);
    return NextResponse.json(config);
  } catch (error) {
    console.error("Erro ao ler os dados da loja:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}