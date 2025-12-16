import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    await db.query(
      `UPDATE pedido 
       SET status = 'cancelado'
       WHERE id = $1 AND status = 'pendente'`,
      [id]
    );

    return NextResponse.json({ message: "Pedido cancelado" });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao cancelar pedido" }, { status: 500 });
  }
}
