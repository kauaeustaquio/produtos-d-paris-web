import db from "@/lib/db";
import "./style.css";
import {
    Pencil,
} from "lucide-react";

// 1. Função para buscar os produtos da API (mantida inalterada)
async function getProdutos() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000';

    try {
        const res = await fetch(`${API_BASE_URL}/api/produtos`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Status HTTP: ${res.status}`);
            throw new Error('Falha ao buscar produtos da API.');
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Erro ao carregar produtos:", error.message);
        return [];
    }
}

export default async function ProdutosdParis({ searchParams }) {
    // ... (Lógica de busca e filtragem inalterada) ...
    const busca = searchParams?.busca?.toLowerCase() || '';

    let usuario = [];
    try {
        usuario = await db.query("select * from usuario");
    } catch (e) {
        console.error("Erro ao buscar usuário (ignorado para carregar produtos):", e);
    }

    const todosOsProdutos = await getProdutos();

    const produtosFiltrados = todosOsProdutos.filter(produto => {
        if (!busca) {
            return true;
        }

        const nomeProduto = produto.nome ? produto.nome.toLowerCase() : '';
        const categoriaProduto = produto.categoria ? produto.categoria.toLowerCase() : '';

        return nomeProduto.includes(busca) || categoriaProduto.includes(busca);
    });

    const produtosPorCategoria = produtosFiltrados.reduce((acc, produto) => {
        const categoria = produto.categoria || 'Outros';
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(produto);
        return acc;
    }, {});

    return (
        <>
            <div className="top-bar">
                <form method="get" className="search-form">
                    <input
                        type="text"
                        className="caixa-de-pesquisa"
                        name="busca"
                        placeholder="Pesquisar..."
                        defaultValue={searchParams?.busca || ''}
                    />
                    <button type="submit" style={{ display: 'none' }}></button>
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

            <div className="main-content">
                <div className="banner">
                    <img src="/img/banner.png" alt="banner" />
                </div>

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

                <div className="page-content">
                    {Object.keys(produtosPorCategoria).length > 0 ? (
                        Object.entries(produtosPorCategoria).map(([categoria, listaDeProdutos]) => (
                            <div key={categoria} className="product-category-section">
                                <h3>{categoria}</h3>

                                <div className="product-grid">
                                    {listaDeProdutos.map(produto => (
                                        <div key={produto.id} className="product-card">
                                            
                                            {/* 💥 MUDANÇA 1: Adiciona o container .card-top-image */}
                                            <div className="card-top-image">
                                                {/* 💥 MUDANÇA 2: Renomeia a classe para .product-image */}
                                                <img
                                                    src={produto.imagem || '/img/placeholder.png'}
                                                    alt={produto.nome}
                                                    className="product-image" 
                                                />
                                            </div>
                                            
                                            <div className="card-info">
                                                <span className="product-name">{produto.nome}</span>
                                                <p className="product-price">
                                                    R$ {parseFloat(produto.valor).toFixed(2).replace('.', ',')}
                                                </p>
                                                
                                                {/* 💥 MUDANÇA 3: Substitui o botão vazio pelo link de edição (Pencil) */}
                                                <a href={`/editar-produto/${produto.id}`} className="edit-icon-link">
                                                    <Pencil className="pencil-icon" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-products-message">
                            {busca
                                ? `Nenhum produto encontrado para "${busca}".`
                                : "Nenhum produto cadastrado no momento."
                            }
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}