import db from "@/lib/db";

export default async function ProdutosdParis() {
  const usuario = await db.query("select * from usuario");

  return (
   <>
   <h1>Pedidos</h1>
   </>
  );
}