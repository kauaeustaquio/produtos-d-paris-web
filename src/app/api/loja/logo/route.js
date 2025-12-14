import { put } from "@vercel/blob";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não enviado" },
        { status: 400 }
      );
    }

    // 🔒 VALIDAÇÃO DE SEGURANÇA
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Arquivo inválido" },
        { status: 400 }
      );
    }

    // Upload no Vercel Blob
    const blob = await put(
      `logos/${Date.now()}-${file.name}`,
      file,
      {
        access: "public",
      }
    );

    // Salva URL no Postgres
    await db.query(
      "UPDATE store_config SET logo_url = $1 WHERE id = 1",
      [blob.url]
    );

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao enviar logo" },
      { status: 500 }
    );
  }
}
