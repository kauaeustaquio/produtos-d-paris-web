import db from "@/lib/db"; // ajuste para seu banco

export async function POST(req) {
  try {
    const data = await req.json();
    const { nome, categoria, valor, imagem } = data;

    if (!nome || !categoria || !valor) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando" }), { status: 400 });
    }

    await db.query(
      "INSERT INTO produtos (nome, categoria, valor, imagem) VALUES ($1, $2, $3, $4)",
      [nome, categoria, valor, imagem]
    );

    return new Response(JSON.stringify({ message: "Produto criado com sucesso" }), { status: 201 });
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    return new Response(JSON.stringify({ error: "Erro no servidor" }), { status: 500 });
  }
}
