import db from "@/lib/db";

export default async function ProdutosdParis() {
  const usuario = await db.query("select * from usuario");

  return (
  <>
  <h1>Pedidos</h1>
  <a href="telaPrincipal" type="button" className="botao">Voltar</a>

   <form method="post">
        <input type="text" className="caixa-de-pesquisa" name="busca" placeholder="Pesquisar..."></input>
   </form>
   {/* Caixa de texto */}
  </>
  );
}