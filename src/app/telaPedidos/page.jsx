import db from "@/lib/db";

export default async function ProdutosdParis() {
  const usuario = await db.query("select * from usuario");

  return (
  <>
    <div className="top-bar">
        <form method="post" className="search-form">
          <input
            type="text"
            className="caixa-de-pesquisa"
            name="busca"
            placeholder="Pesquisar..."
          ></input>
        </form>
        <a href="telaInfo" className="info-icon">
          <img src="/img/info.png" alt="Informações" />
        </a>
      </div>
      
  <h1>Pedidos</h1>
  <a href="telaPrincipal" type="button" className="botao">Voltar</a>

   <form method="post">
        <input type="text" className="caixa-de-pesquisa" name="busca" placeholder="Pesquisar..."></input>
   </form>
   {/* Caixa de texto */}
  </>
  );
}