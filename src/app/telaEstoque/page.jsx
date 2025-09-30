"use client";

import React, { useState, useEffect } from "react";
import {
    CircleX,
    CirclePlus,
    Upload,
    Search,
    Trash2,
    Pencil,
    CircleCheck,
} from "lucide-react";
import "./style.css";

export default function TelaEstoque() {
    const [popupAberto, setPopupAberto] = useState(false);
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [imagem, setImagem] = useState(null); 
    const [imagemPreview, setImagemPreview] = useState(null); 
    const [searchTerm, setSearchTerm] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [produtoEditando, setProdutoEditando] = useState(null); 

    const categoriasFiltro = ['Todos', 'Casa', 'Carros', 'Piscina', 'Essências'];

    const fecharPopup = () => {
        setPopupAberto(false);
        setProdutoEditando(null); 
        setNome("");
        setCategoria("");
        setValor("");
        setImagem(null);
        setImagemPreview(null);
    };

    const abrirPopupAdicionar = () => {
        setProdutoEditando(null); 
        setNome("");
        setCategoria("");
        setValor("");
        setImagem(null);
        setImagemPreview(null);
        setPopupAberto(true);
    };
    
    const abrirPopupEdicao = (produto) => {
        setProdutoEditando(produto); 
        
        setNome(produto.nome);
        setCategoria(produto.categoria);
        setValor(String(produto.valor).replace('.', ',')); 
        setImagem(produto.imagem);
        setImagemPreview(produto.imagem);
        
        setPopupAberto(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagem(reader.result);
                setImagemPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagem(null);
            setImagemPreview(null);
        }
    };

    // FUNÇÃO UNIFICADA: Lida com a criação (POST) e atualização (PUT)
    const handleSaveProduct = async () => {
        if (!nome || !categoria || !valor || !imagem) {
            alert("Preencha todos os campos e selecione uma imagem!");
            return;
        }
        
        const valorNumerico = parseFloat(String(valor).replace(',', '.'));

        const method = produtoEditando ? 'PUT' : 'POST';
        const url = produtoEditando ? `/api/produtos/${produtoEditando.id}` : '/api/produtos';

        // CORPO DA REQUISIÇÃO: SEM QUANTIDADE
        const requestBody = {
            nome, 
            categoria, 
            valor: valorNumerico, 
            imagem,
        };

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
                throw new Error(`Erro ao ${produtoEditando ? 'atualizar' : 'adicionar'} produto: ${errorData.message || res.statusText}`);
            }

            console.log(`Produto ${produtoEditando ? 'atualizado' : 'adicionado'} com sucesso!`);
            fecharPopup();
            fetchProdutos();
        } catch (error) {
            console.error(`Falha ao ${produtoEditando ? 'atualizar' : 'enviar'} produto:`, error);
            alert(`Não foi possível ${produtoEditando ? 'atualizar' : 'adicionar'} o produto. Tente novamente. Detalhe: ${error.message}`);
        }
    };
    
    const isFormValid = nome && categoria && valor && imagem;
    
    const fetchProdutos = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/produtos?search=${searchTerm}&category=${activeFilter === 'Todos' ? '' : activeFilter}`);
            if (!res.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            const data = await res.json();
            setProdutos(data);
        } catch (error) {
            console.error("Falha ao buscar produtos:", error);
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteClick = (productId) => {
        setProductToDelete(productId);
        setIsDeletePopupOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;
    
        try {
            const res = await fetch(`/api/produtos/${productToDelete}`, {
                method: 'DELETE',
            });
    
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
                throw new Error(`Erro ao deletar produto: ${errorData.message || res.statusText}`);
            }
    
            console.log("Produto deletado com sucesso!");
            setIsDeletePopupOpen(false);
            setProductToDelete(null);
            fetchProdutos();
    
        } catch (error) {
            console.error("Falha ao deletar produto:", error);
            alert(`Não foi possível deletar o produto. Tente novamente. Detalhe: ${error.message}`);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeletePopupOpen(false);
        setProductToDelete(null);
    };

    useEffect(() => {
        fetchProdutos();
    }, [searchTerm, activeFilter]);

    const handleFilterClick = (category) => {
        setActiveFilter(category);
        setIsFilterPopupOpen(false);
    };

    return (
        <>
            <div className="top-bar">
                <a href="/telaPrincipal" className="home-botao">
                    <img src="/img/home-botao.png" alt="Ícone de Home" style={{ width: '40px', height: '40px' }} />
                </a>
            
                    <div className="right-icons">
                        <a href="telaInfo" className="info-icon">
                            <img src="/img/info-botao.png" alt="Ícone de Informações" />
                        </a>
                        <a href="telaUsuario" className="user-icon">
                            <img src="/img/usuario-icone-branco.png" alt="Usuário"/>
                        </a>
                    </div>
            </div>
            
            <div className="main-content">
                <div className="stock-container">
                    <header className="stock-header">
                        <img src="/img/estoque-icone.png" alt="Ícone de Estoque" />
                        <h1>Gerenciar estoque</h1>
                    </header>

                    <div className="controls-bar">
                        <div className="search-container">
                            <Search size={20} color="#888" />
                            <input
                                type="text"
                                placeholder="Pesquisar produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        
                        <div className="stats-container">
                            <span>{produtos.length} produtos foram <br/> cadastrados</span>
                        </div>
                        
                        <div className="filter-container">
                            <a href="#" className="filter-link" onClick={() => setIsFilterPopupOpen(true)}>
                                <img src="/img/Filter.png" alt="Ícone de Filtro" />
                                <span>Filtrar</span>
                            </a>

                            {isFilterPopupOpen && (
                                <div className="filter-popup-content-positioned">
                                    <button className="filter-close-btn" onClick={() => setIsFilterPopupOpen(false)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6L6 18M6 6L18 18" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <h2>Selecionar...</h2>
                                    <div className="filter-button-group">
                                        {categoriasFiltro.map((category) => (
                                            <button
                                                key={category}
                                                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                                                onClick={() => handleFilterClick(category)}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <a href="#" className="categories-link">
                            <img src="/img/Categorias.png" alt="Ícone de Categorias" />
                            <span>Categorias</span>
                        </a>

                        <button className="new-product-btn" onClick={abrirPopupAdicionar}>
                            <span className="btn-text">Novo produto</span>
                            <img src="/img/adicionar-botao.png" alt="Ícone de adicionar" />
                        </button>
                    </div>

                    <div className="product-table-container">
                        <div className="product-table-header">
                            <span className="col-checkbox"></span>
                            <span className="col-produto">Produtos</span>
                            <span className="col-categoria">Categoria</span>
                            <span className="col-valor">Valor</span>
                            <span className="col-actions"></span>
                        </div>

                        {loading ? (
                            <p>Carregando...</p>
                        ) : produtos.length > 0 ? (
                            <ul className="product-list">
                                {produtos.map(produto => (
                                    <li key={produto.id} className="product-item">
                                        <div className="product-details-group">
                                            <div className="product-image-card"> 
                                                <img src={produto.imagem} alt={produto.nome} className="product-image" />
                                            </div>
                                            <div className="product-details-text">
                                                <h3>{produto.nome}</h3>
                                            </div>
                                        </div>
                                        <span className="col-categoria-item">{produto.categoria}</span>
                                        <span className="col-valor-item">R$ {parseFloat(produto.valor).toFixed(2).replace('.', ',')}</span>
                                        <div className="product-actions">
                                            <button 
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteClick(produto.id)}
                                            >
                                                <Trash2 size={24} color="#000" />
                                            </button>
                                            <button 
                                                className="action-btn edit-btn"
                                                onClick={() => abrirPopupEdicao(produto)} 
                                            >
                                                <Pencil size={24} color="#000" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-products-message">Nenhum produto encontrado.</p>
                        )}
                    </div>

                    {popupAberto && (
                        <div className="popup-overlay">
                            <div className="popup-content">                      
                                <button className="close-btn" onClick={fecharPopup}>
                                    <CircleX size={28} color="#aaa" />
                                </button>
                                
                                <div className="popup-left">
                                    <label className="upload-label">
                                        <input type="file" onChange={handleFileChange} />
                                        {imagemPreview ? (
                                            <img src={imagemPreview} alt="Pré-visualização do produto" className="uploaded-image-preview" />
                                        ) : (
                                            <>
                                                <Upload size={48} color="#888" />
                                                <span>Selecione a imagem do produto</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                                
                                <div className="popup-right">
                                    <label htmlFor="nome">Nome do produto:</label>
                                    <input
                                        id="nome"
                                        type="text"
                                        placeholder="Ex. Veja Limpeza Multiuso 500ml"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />

                                    <label htmlFor="categoria">Categoria</label>
                                    <select
                                        id="categoria"
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                    >
                                        <option value="" disabled>Selecionar...</option>
                                        <option value="Casa">Casa</option>
                                        <option value="Carros">Carros</option>
                                        <option value="Piscina">Piscina</option>
                                        <option value="Cozinhas">Cozinhas</option>
                                        <option value="Essências">Essências</option>
                                        <option value="--">-</option>
                                    </select>

                                    <label htmlFor="valor">Valor</label>
                                    <input
                                        id="valor"
                                        type="text"
                                        placeholder="Ex: 12,00"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                    />

                                    <button
                                        onClick={handleSaveProduct} 
                                        className={`submit-btn ${isFormValid ? "enabled" : ""}`}
                                        disabled={!isFormValid}
                                    >
                                        {produtoEditando ? 'Atualizar' : 'Adicionar'} 
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isDeletePopupOpen && (
                        <div className="popup-overlay delete-popup-overlay">
                            <div className="popup-content delete-popup-content">
                                <h2 className="delete-title">Tem certeza que deseja deletar este produto?</h2>
                                <p className="delete-message">Essa ação não pode ser desfeita.</p>
                                <div className="delete-buttons">
                                    <button 
                                        onClick={handleDeleteCancel} 
                                        className="delete-cancel-btn"
                                    >
                                        <CircleX size={32} color="#dc3545" />
                                        <span>Cancelar</span>
                                    </button>
                                    <button 
                                        onClick={handleDeleteConfirm} 
                                        className="delete-confirm-btn"
                                    >
                                        <CircleCheck size={32} color="#28a745" />
                                        <span>Deletar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}