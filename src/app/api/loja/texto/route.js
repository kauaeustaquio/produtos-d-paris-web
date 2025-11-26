// app/api/loja/texto/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'store_info.json');

export async function POST(request) {
  const allowedFields = ['aboutText', 'location', 'contact'];
  let field = null;
  let value = null;

  try {
    const body = await request.json();
    field = body.field;
    value = body.value;

    if (!field || !value || !allowedFields.includes(field)) {
      return NextResponse.json({ error: 'Campos inválidos ou campo desconhecido' }, { status: 400 });
    }

    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);

    let newValue;
    
    if (field === 'aboutText') {
      // O valor é uma string simples de texto
      newValue = value;
    } else if (field === 'location' || field === 'contact') {
      // O valor deve ser um objeto JSON (enviado como string)
      newValue = JSON.parse(value);
    } 
    
    config[field] = newValue;

    // Escreve os dados atualizados no arquivo
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    // Retorna o valor atualizado (como objeto se for location/contact)
    return NextResponse.json({ success: true, value: newValue });
    
  } catch (error) {
    // Captura erros de parsing JSON ou outros erros de servidor
    if (error instanceof SyntaxError && (field === 'location' || field === 'contact')) {
        console.error('Erro ao parsear JSON:', error);
        return NextResponse.json({ error: 'Formato JSON inválido para Localização/Contato. Use aspas duplas.' }, { status: 400 });
    }
    console.error('Erro ao salvar o texto:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}