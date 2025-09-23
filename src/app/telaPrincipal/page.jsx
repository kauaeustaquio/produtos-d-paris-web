import db from "@/lib/db";
import "./style.css";

export default async function ProdutosdParis() {
  const usuario = await db.query("select * from usuario");
  return (
    <>
      {/* container da barra superior cinza, que será fixo */}
      <div className="top-bar">
        <form method="post" className="search-form">
          {/* Tag <input> corrigida */}
          <input
            type="text"
            className="caixa-de-pesquisa"
            name="busca"
            placeholder="Pesquisar..."
          />
        </form>

        {/* Novo contêiner para agrupar os ícones da direita */}
        <div className="right-icons">
          <a href="telaInfo" className="info-icon">
            <img src="/img/info-icone.png" alt="Informações" />
          </a>

          <a href="telaUsuario" className="user-icon">
            {/* Tag <img> corrigida */}
            <img src="/img/usuario-icone.png" alt="Usuário"/>
          </a>
        </div>
      </div>

      {/* 2. Este é o container principal, que vai abaixo da barra fixa */}
      <div className="main-content">
        {/* O banner está dentro do main-content */}
        <div className="banner">
          <img src="/img/banner.png" alt="banner" />
        </div>
        
        {/*Container para os ícones e links de Pedidos e Estoque */}
        <div className="nav-links-container">
          <a href="telaPedidos" className="nav-item">
            <img src="/img/pedidos-icone.png" alt="Pedidos" />
            <span>Pedidos</span>
          </a>
          <a href="telaEstoque" className="nav-item">
            <img src="/img/estoque-icone.png" alt="Estoque" />
            <span>Estoque</span>
          </a>
          <a href="telaClientes" className="nav-item">
            <img src="/img/clientes-icone.png" alt="Clientes" />
            <span>Clientes</span>
          </a>
        </div>

        {/* O restante do conteúdo da página, agrupado para melhor organização */}
        <div className="page-content">
          <h3>Limpeza de Piscina</h3>
          {/* ... restante do seu código de produtos ... */}
        </div>
      </div>
    </>
  );
}