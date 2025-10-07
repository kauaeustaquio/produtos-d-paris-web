import db from "@/lib/db";
import "./style.css";
import {
    Pencil,
} from "lucide-react";

// Importa o componente cliente corrigido
import { SearchInput } from '@/components/SearchInput'; 
// NOTA: Se você tiver problemas, mude para o caminho relativo: import { SearchInput } from '../../components/SearchInput';


// Função para buscar os produtos da API (utiliza o termo de busca)
async function getProdutos(buscaTermo = '') {
    const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000';

    // Se houver termo de busca, adiciona à URL para que a API filtre no banco de dados (mais eficiente)
    const url = buscaTermo 
        ? `${API_BASE_URL}/api/produtos?search=${encodeURIComponent(buscaTermo)}`
        : `${API_BASE_URL}/api/produtos`;

    try {
        const res = await fetch(url, {
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

// O Server Component que renderiza a página
export default async function ProdutosdParis({ searchParams }) {
    
    const { busca: buscaParam = '' } = searchParams;
    const busca = buscaParam;

    let usuario = [];
    try {
        usuario = await db.query("select * from usuario");
    } catch (e) {
        console.error("Erro ao buscar usuário (ignorado para carregar produtos):", e);
    }

    const produtosFiltrados = await getProdutos(busca);

    const produtosPorCategoria = produtosFiltrados.reduce((acc, produto) => {
        const categoria = produto.categoria || 'Outros';
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(produto);
        return acc;
    }, {});

    // Função de formatação de preço
    const formatPrice = (price) => {
        return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
    };

    return (
        <>
            <div className="top-bar">
                {/* Substituição do formulário manual: Usa o componente cliente SearchInput */}
                <SearchInput />
                
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
                                    {listaDeProdutos.map(produto => {
                                        // 1. CALCULA O NOVO VALOR AQUI (FORMA 1 - MELHOR PRÁTICA)
                                        const precoOriginal = parseFloat(produto.valor);
                                        const isPromocao = produto.emPromocao;
                                        const descontoPercentual = produto.desconto || 0;
                                        
                                        let valorComDesconto = precoOriginal;
                                        
                                        if (isPromocao && descontoPercentual > 0) {
                                            valorComDesconto = precoOriginal * (1 - descontoPercentual / 100);
                                        }

                                        const exibirDesconto = isPromocao && descontoPercentual > 0;
                                        
                                        return (
                                            <div key={produto.id} className="product-card">
                                                
                                                <div className="card-top-image">
                                                    {exibirDesconto && (
                                                        // Tag de desconto visível
                                                        <span className="discount-tag" style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                                            -{descontoPercentual}%
                                                        </span>
                                                    )}
                                                    <img
                                                        src={produto.imagem || '/img/placeholder.png'}
                                                        alt={produto.nome}
                                                        className="product-image" 
                                                    />
                                                </div>
                                                
                                                <div className="card-info">
                                                    <span className="product-name">{produto.nome}</span>
                                                    
                                                    <p className="product-price">
                                                        {exibirDesconto && (
                                                            // Valor original riscado (preço de lista)
                                                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px', fontSize: '0.9em' }}>
                                                                {formatPrice(precoOriginal)}
                                                            </span>
                                                        )}
                                                        
                                                        {/* Valor exibido: o preço com desconto (se houver), senão o original */}
                                                        <span style={{ color: exibirDesconto ? 'red' : 'green', fontWeight: 'bold' }}>
                                                            {formatPrice(valorComDesconto)}
                                                        </span>
                                                    </p>
                                                    
                                                    <a href={`/editar-produto/${produto.id}`} className="edit-icon-link">
                                                        <Pencil className="pencil-icon" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
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