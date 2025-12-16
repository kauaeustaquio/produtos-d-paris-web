import db from "@/lib/db";

export default async function ProdutosdParis() {
  const pedidos = await db.query(`
    SELECT 
      p.id,
      p.nome_cliente,
      p.forma_pagamento,
      p.total,
      p.status,
      STRING_AGG(pi.quantidade || 'x ' || pi.nome, ', ') AS itens
    FROM pedido p
    JOIN pedido_item pi ON pi.pedido_id = p.id
    GROUP BY p.id
    ORDER BY p.criado_em DESC
  `);

  return (
    <>
      <div className="top-bar">
        <form className="search-form">
          <input
            type="text"
            className="caixa-de-pesquisa"
            placeholder="Pesquisar pedido..."
          />
        </form>
        <a href="telaInfo" className="info-icon">
          <img src="/img/info.png" alt="Informações" />
        </a>
      </div>

      <h1>Pedidos</h1>
      <a href="telaPrincipal" className="botao">Voltar</a>

      <div className="lista-pedidos">
        {pedidos.rows.map(pedido => (
          <div key={pedido.id} className="card-pedido">
            <p><strong>Pedido:</strong> #{pedido.id}</p>
            <p><strong>Cliente:</strong> {pedido.nome_cliente}</p>
            <p><strong>Itens:</strong> {pedido.itens}</p>
            <p><strong>Pagamento:</strong> {pedido.forma_pagamento}</p>
            <p><strong>Total:</strong> R$ {pedido.total}</p>
            <p><strong>Status:</strong> {pedido.status}</p>

            {pedido.status === "pendente" && (
              <form action={`/api/pedidos/${pedido.id}/concluir`} method="post">
                <button className="botao">Concluir pedido</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
