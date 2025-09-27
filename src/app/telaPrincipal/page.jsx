import db from "@/lib/db";
import "./style.css";
import {
    Pencil,
} from "lucide-react";
// 1. Função para buscar os produtos da API
async function getProdutos() {
  // ATENÇÃO: Use o endereço base da sua aplicação Next.js.
  // Em desenvolvimento, geralmente é http://localhost:3000
  // Em produção, use o endereço da Vercel/servidor, se disponível.
  const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000';
    
  try {
    // Faz a chamada para a sua API Route (a mesma que TelaEstoque usa para ler)
    const res = await fetch(`${API_BASE_URL}/api/produtos`, {
      // Usar 'no-store' garante que os dados sejam sempre atualizados na tela principal
      cache: 'no-store' 
    });

    if (!res.ok) {
      console.error(`Status HTTP: ${res.status}`);
      // Se a API falhar, lance um erro.
      throw new Error('Falha ao buscar produtos da API.');
    }

    const data = await res.json();
    return data;
    
  } catch (error) {
    console.error("Erro ao carregar produtos:", error.message);
    // Retorna um array vazio em caso de falha para evitar quebra do componente
    return []; 
  }
}

export default async function ProdutosdParis() {
  // 2. Tenta buscar o usuário (mantido o seu código original, 
  // mas lembre-se de resolver o erro ECONNREFUSED)
  let usuario = [];
  try {
      usuario = await db.query("select * from usuario");
  } catch (e) {
      console.error("Erro ao buscar usuário (ignorado para carregar produtos):", e);
  }
  
  // 3. Busca a lista de produtos
  const produtos = await getProdutos();
  
  // Opcional: Agrupar produtos por categoria para exibição
  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    const categoria = produto.categoria || 'Outros'; // Garante uma categoria
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(produto);
    return acc;
  }, {});

  return (
    <>
      {/* container da barra superior cinza, que será fixo */}
      <div className="top-bar">
        {/* ... (código da barra superior omitido por brevidade) ... */}
        <form method="post" className="search-form">
          <input
            type="text"
            className="caixa-de-pesquisa"
            name="busca"
            placeholder="Pesquisar..."
          />
        </form>
        <div className="right-icons">
          <a href="telaInfo" className="info-icon">
            <img src="/img/info-icone.png" alt="Informações" />
          </a>
          <a href="telaUsuario" className="user-icon">
            <img src="/img/usuario-icone.png" alt="Usuário"/>
          </a>
        </div>
      </div>

      {/* 2. Este é o container principal, que vai abaixo da barra fixa */}
      <div className="main-content">
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
            {/* 4. RENDERIZAÇÃO DOS PRODUTOS AGRUPADOS */}
            {Object.keys(produtosPorCategoria).length > 0 ? (
                Object.entries(produtosPorCategoria).map(([categoria, listaDeProdutos]) => (
                    <div key={categoria} className="product-category-section">
                        {/* Exibe o título da categoria (Ex: Limpeza de Piscina) */}
                        <h3>{categoria}</h3>
                        
                        <div className="product-grid">
                            {listaDeProdutos.map(produto => (
                                <div key={produto.id} className="product-card">
                                    {/* A imagem é a Data URL salva no banco de dados */}
                                    <img 
                                        src={produto.imagem || '/img/placeholder.png'} 
                                        alt={produto.nome} 
                                        className="card-image" 
                                    />
                                    <div className="card-info">
                                        <h4>{produto.nome}</h4>
                                        <p className="product-price">
                                            R$ {parseFloat(produto.valor).toFixed(2).replace('.', ',')}
                                        </p>
                                        <button className="editar-produto-tela-principal"></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-products-message">Nenhum produto cadastrado no momento.</p>
            )}
        </div>
      </div>
    </>
  );
}