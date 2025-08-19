import db from "@/lib/db";

export default async function ProdutosdParis() {
  const usuario = await db.query("select * from usuario");
  return (
   <>
      <form method="post">

        <input type="text" className="caixa-de-pesquisa" name="busca" placeholder="Pesquisar..."></input>
      </form>
          
  
      <div>
            <a href="telaInfo" type="button" className="botao"> 
             <img src="/img/info.png"/>
          </a>
          <h1>Produtos d'Paris</h1>
            <a href="telaPedidos" type="button" className="botao"> Pedidos</a>
            <a href="telaEstoque" type="button" className="botao"> Estoque</a>

          <h3>Limpeza de Piscina</h3>
            
      </div>
   </>
  );
}