import { NextResponse } from "next/server";
import db from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const {
      usuario_id,
      nome_cliente,
      forma_pagamento,
      itens
    } = await req.json();

    if (!itens || itens.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const pedidoId = randomUUID();

    let total = 0;
    itens.forEach(item => {
      total += (item.valor - (item.desconto || 0)) * item.quantidade;
    });

    await db.query(
      `INSERT INTO pedido (id, usuario_id, nome_cliente, total, forma_pagamento)
       VALUES ($1, $2, $3, $4, $5)`,
      [pedidoId, usuario_id, nome_cliente, total, forma_pagamento]
    );

    for (const item of itens) {
      await db.query(
        `INSERT INTO pedido_item 
        (id, pedido_id, produto_id, nome, valor, quantidade, desconto, em_promocao, imagem)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          randomUUID(),
          pedidoId,
          item.produto_id,
          item.nome,
          item.valor,
          item.quantidade,
          item.desconto || 0,
          item.em_promocao || false,
          item.imagem || null
        ]
      );
    }

    return NextResponse.json({ pedidoId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
