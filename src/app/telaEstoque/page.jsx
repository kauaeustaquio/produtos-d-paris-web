"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CircleX, Search, Trash2, Pencil, CircleCheck } from "lucide-react";
import "./style.css";
// Importando os novos componentes
import ProductTableRow from "./pageComponents/ProductTableRow";
import ProductFormModal from "./pageComponents/ProductFormModal";
import ConfirmationModal from "./pageComponents/ConfirmationModal";
import FilterAndStatsBar from "./pageComponents/FilterAndStatsBar";
import { useBlobUrlCleanup } from './utils/useBlobUrlCleanup'; 
import { formatarParaBRL, calcularValorComDesconto } from './utils/formatters'; // Assumindo que você separou as funções em formatters.js


export default function TelaEstoque() {
    const [popupAberto, setPopupAberto] = useState(false);
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    
    // 'imagem' armazena o objeto File
    const [imagem, setImagem] = useState(null); 
    // 'imagemPreview' armazena a Blob URL ou a URL da imagem existente
    const [imagemPreview, setImagemPreview] = useState(null); 
    
    const [searchTerm, setSearchTerm] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [produtoEditando, setProdutoEditando] = useState(null); 
    const [desconto, setDesconto] = useState(0);
    const [emPromocao, setEmPromocao] = useState(false);

    const categoriasFiltro = ['Todos', 'Casa', 'Carros', 'Piscina', 'Perfumaria'];

    // Gera opções de desconto
    const descontosOpcoes = useMemo(() => {
        const options = [];
        for (let i = 0; i <= 100; i += 5) {
            options.push(i);
        }
        return options;
    }, []);

    // ----------------------------------------------------
    // LIMPEZA DE MEMÓRIA (BLOB URL)
    // Revoga a Blob URL sempre que imagemPreview mudar.
    useBlobUrlCleanup(imagemPreview); 
    // ----------------------------------------------------
    
    // ----------------------------------------------------
    // MANIPULADORES DE ESTADO E POPUP
    // ----------------------------------------------------
    
    const fecharPopup = () => {
        // Limpa a Blob URL manualmente antes de fechar o popup,
        // no caso de um novo arquivo ter sido selecionado e o usuário cancelar.
        if (imagemPreview && typeof imagemPreview === 'string' && imagemPreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagemPreview);
        }

        setPopupAberto(false);
        setProdutoEditando(null); 
        setNome("");
        setCategoria("");
        setValor("");
        setImagem(null);
        setImagemPreview(null);
        setDesconto(0); 
        setEmPromocao(false);
    };

    const abrirPopupAdicionar = () => {
        setProdutoEditando(null); 
        // Resetamos o estado para o formulário de adição
        setNome("");
        setCategoria("");
        setValor("");
        setImagem(null);
        setImagemPreview(null);
        setDesconto(0);
        setEmPromocao(false);
        setPopupAberto(true);
    };
    
    const abrirPopupEdicao = (produto) => {
        setProdutoEditando(produto); 

        setNome(produto.nome);
        setCategoria(produto.categoria);
        setValor(String(produto.valor).replace('.', ',')); 
        
        // Se a imagem for uma URL de API (string), usamos ela, caso contrário, null (o usuário precisará enviar um novo File)
        setImagem(typeof produto.imagem === 'string' ? null : produto.imagem); 
        setImagemPreview(produto.imagem); // Exibe a URL de imagem existente
        
        const desc = produto.desconto || 0;
        setDesconto(desc);
        setEmPromocao(desc > 0); 
        setPopupAberto(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImagem(file); // Armazena o objeto File original
            
            // Cria uma Blob URL para o preview (Mais eficiente que Base64)
            const fileURL = URL.createObjectURL(file);
            
            // O cleanup do hook 'useBlobUrlCleanup' irá revogar a URL anterior
            setImagemPreview(fileURL); 

        } else {
            setImagem(null);
            setImagemPreview(null);
        }
    };
    
    // ----------------------------------------------------
    // LÓGICA DE API
    // ----------------------------------------------------

    const handleSaveProduct = async () => {
        // Verifica se há nome, categoria e valor
        if (!nome || !categoria || !valor) {
            alert("Preencha todos os campos.");
            return;
        }

        // Se estiver adicionando, a imagem é obrigatória
        if (!produtoEditando && !imagem) {
            alert("Selecione uma imagem para o novo produto!");
            return;
        }
        
        const valorNumerico = parseFloat(String(valor).replace(',', '.'));

        const method = produtoEditando ? 'PUT' : 'POST';
        const url = produtoEditando ? `/api/produtos/${produtoEditando.id}` : '/api/produtos';

        // Usando FormData para enviar dados e o objeto File
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('categoria', categoria);
        formData.append('valor', valorNumerico);
        formData.append('desconto', desconto);
        formData.append('emPromocao', emPromocao);
        
        // Só adiciona a imagem se for um novo File.
        // Se for uma string (URL de imagem existente), o backend deve saber como lidar.
        if (imagem instanceof File) {
            formData.append('imagem', imagem); 
        }

        if (produtoEditando) {
            formData.append('id', produtoEditando.id);
        }

        try {
            const res = await fetch(url, {
                method: method,
                // **IMPORTANTE:** Não defina o cabeçalho 'Content-Type' para FormData
                body: formData, 
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
            alert(`Não foi possível ${produtoEditando ? 'atualizar' : 'adicionar'} o produto. Detalhe: ${error.message}`);
        }
    };
    
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
            {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
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
                <div className="stock-container"> {/* <-- CORRIGIDO AQUI */}
                    <header className="stock-header"> {/* <-- CORRIGIDO AQUI */}
                        <img src="/img/estoque-icone.png" alt="Ícone de Estoque" />
                        <h1>Gerenciar estoque</h1>
                    </header>

                    {/* Componente: FilterAndStatsBar */}
                    <FilterAndStatsBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        produtosCount={produtos.length}
                        isFilterPopupOpen={isFilterPopupOpen}
                        setIsFilterPopupOpen={setIsFilterPopupOpen}
                        activeFilter={activeFilter}
                        handleFilterClick={handleFilterClick}
                        categoriasFiltro={categoriasFiltro}
                        onAddProduct={abrirPopupAdicionar}
                    />

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
                                {/* Componente: ProductTableRow */}
                                {produtos.map(produto => (
                                    <ProductTableRow
                                        key={produto.id}
                                        produto={produto}
                                        onEdit={abrirPopupEdicao}
                                        onDelete={handleDeleteClick}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="no-products-message">Nenhum produto encontrado.</p>
                        )}
                    </div>

                    {/* Componente: ProductFormModal */}
                    {popupAberto && (
                        <ProductFormModal
                            produtoEditando={produtoEditando}
                            onClose={fecharPopup}
                            onSave={handleSaveProduct}
                            nome={nome} setNome={setNome}
                            categoria={categoria} setCategoria={setCategoria}
                            valor={valor} setValor={setValor}
                            imagemPreview={imagemPreview}
                            handleFileChange={handleFileChange}
                            desconto={desconto} setDesconto={setDesconto}
                            emPromocao={emPromocao} setEmPromocao={setEmPromocao}
                            descontosOpcoes={descontosOpcoes}
                        />
                    )}

                    {/* Componente: ConfirmationModal */}
                    {isDeletePopupOpen && (
                        <ConfirmationModal
                            title="Tem certeza que deseja deletar este produto?"
                            message="Essa ação não pode ser desfeita."
                            onCancel={handleDeleteCancel}
                            onConfirm={handleDeleteConfirm}
                        />
                    )}
                </div>
            </div>
        </>
    );
}