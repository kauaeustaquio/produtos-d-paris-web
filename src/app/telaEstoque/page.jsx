"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CircleX, Search, Trash2, Pencil, CircleCheck } from "lucide-react";
import "./style.css";
import ProductTableRow from "./pageComponents/ProductTableRow";
import ProductFormModal from "./pageComponents/ProductFormModal";
import ConfirmationModal from "./pageComponents/ConfirmationModal";
import FilterAndStatsBar from "./pageComponents/FilterAndStatsBar";
import { useBlobUrlCleanup } from './utils/useBlobUrlCleanup'; 
import CategoryFormModal from "./pageComponents/CategoryFormModal";
import { formatarParaBRL, calcularValorComDesconto } from './utils/formatters'; 

export default function TelaEstoque() {
    const [popupAberto, setPopupAberto] = useState(false);
    const [nome, setNome] = useState("");
    // Se a categoria agora é um ID no DB, é melhor chamá-la de categoriaId e usar string para manter compatibilidade temporária:
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
    const [desconto, setDesconto] = useState(0);
    const [emPromocao, setEmPromocao] = useState(false);

    // ESTADOS PARA CATEGORIA (CORRIGIDO)
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categoriaObjetos, setCategoriaObjetos] = useState([]); 
    const [categoriasFiltro, setCategoriasFiltro] = useState(['Todos']);
    // REMOVIDO: A linha duplicada 'const categoriasFiltro = [...]'
    // A lista de filtros agora será carregada via fetchCategorias

    const descontosOpcoes = useMemo(() => {
        const options = [];
        for (let i = 0; i <= 100; i += 5) {
            options.push(i);
        }
        return options;
    }, []);

    // LIMPEZA DE MEMÓRIA (BLOB URL)
    useBlobUrlCleanup(imagemPreview); 
    
    // --- FUNÇÕES DE CATEGORIA ---

    const fetchCategorias = async () => {
        try {
            // OBS: Assume que '/api/categorias' retorna uma lista de objetos: [{ id: 1, nome: 'Casa' }, ...]
            const res = await fetch('/api/categorias');
            if (!res.ok) {
                throw new Error('Erro ao buscar categorias');
            }
            const data = await res.json();
            
            setCategoriaObjetos(data); 
            setCategoriasFiltro(['Todos', ...data.map(c => c.nome)]); 

        } catch (error) {
            console.error("Falha ao buscar categorias:", error);
        }
    };

    const openCategoryPopup = () => {
        setNewCategoryName("");
        setIsCategoryPopupOpen(true);
    };

    const closeCategoryPopup = () => {
        setNewCategoryName("");
        setIsCategoryPopupOpen(false);
    };

    const handleSaveCategory = async () => {
        if (!newCategoryName.trim()) {
            alert("Preencha o nome da categoria.");
            return;
        }

        try {
            // OBS: Endpoint da API para salvar a nova categoria no DB
            const res = await fetch('/api/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: newCategoryName.trim() }), 
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
                throw new Error(`Erro ao adicionar categoria: ${errorData.message || res.statusText}`);
            }

            console.log("Categoria adicionada com sucesso!");
            closeCategoryPopup();
            await fetchCategorias(); // Recarrega a lista de categorias e filtros
            
        } catch (error) {
            console.error("Falha ao adicionar categoria:", error);
            alert(`Não foi possível adicionar a categoria. Detalhe: ${error.message}`);
        }
    };

    // --- POPUP DE PRODUTO ---

    const fecharPopup = () => {
        if (imagemPreview && typeof imagemPreview === 'string' && imagemPreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagemPreview);
        }

        setPopupAberto(false);
        setProdutoEditando(null); 
        setNome("");
        setCategoria(""); // Categoria é redefinida
        setValor("");
        setImagem(null);
        setImagemPreview(null);
        setDesconto(0); 
        setEmPromocao(false);
    };

    const abrirPopupAdicionar = () => {
        setProdutoEditando(null); 
        setNome("");
        setCategoria(""); // Categoria é redefinida
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
        // Assumindo que produto.categoria agora é o ID da categoria
        setCategoria(produto.categoria); 
        setValor(String(produto.valor).replace('.', ',')); 
        
        setImagem(typeof produto.imagem === 'string' ? null : produto.imagem); 
        setImagemPreview(produto.imagem); 
        
        const desc = produto.desconto || 0;
        setDesconto(desc);
        setEmPromocao(desc > 0); 
        setPopupAberto(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImagem(file); 
            const fileURL = URL.createObjectURL(file);
            setImagemPreview(fileURL); 

        } else {
            setImagem(null);
            setImagemPreview(null);
        }
    };
 
    const handleSaveProduct = async () => {
        // Verificação: 'categoria' agora deve ser o ID ou nome da categoria selecionada
        if (!nome || !categoria || !valor) { 
            alert("Preencha todos os campos.");
            return;
        }

        if (!produtoEditando && !imagem) {
            alert("Selecione uma imagem para o novo produto!");
            return;
        }
        
        const valorNumerico = parseFloat(String(valor).replace(',', '.'));

        const method = produtoEditando ? 'PUT' : 'POST';
        const url = produtoEditando ? `/api/produtos/${produtoEditando.id}` : '/api/produtos';

        const formData = new FormData();
        formData.append('nome', nome);
        // Envia o ID ou Nome da categoria, dependendo de como você refatorou o DB/API
        formData.append('categoria', categoria); 
        formData.append('valor', valorNumerico);
        formData.append('desconto', desconto);
        formData.append('emPromocao', emPromocao);
        
        if (imagem instanceof File) {
            formData.append('imagem', imagem); 
        }

        if (produtoEditando) {
            formData.append('id', produtoEditando.id);
        }

        try {
            const res = await fetch(url, {
                method: method,
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

    // --- USE EFFECT ---
    useEffect(() => {
        fetchCategorias(); // Buscar categorias na montagem
    }, []);

    useEffect(() => {
        fetchProdutos();
    }, [searchTerm, activeFilter, categoriaObjetos]); // Adicionado categoriaObjetos como dependência para recarregar produtos se categorias mudarem

    const handleFilterClick = (category) => {
        setActiveFilter(category);
        setIsFilterPopupOpen(false);
    };

    // --- JSX (RENDERIZAÇÃO) ---

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
                <div className="stock-container"> 
                    <header className="stock-header"> 
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
                        categoriasFiltro={categoriasFiltro} // USANDO O ESTADO DINÂMICO
                        onAddProduct={abrirPopupAdicionar}
                        onAddCategory={openCategoryPopup} // NOVO PROP PARA O POPUP DE CATEGORIA
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
                            categoriaObjetos={categoriaObjetos} // PASSANDO OS OBJETOS DE CATEGORIA
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

                    {/* Componente: CategoryFormModal */}
                    {isCategoryPopupOpen && (
                        <CategoryFormModal
                            onClose={closeCategoryPopup}
                            onSave={handleSaveCategory}
                            newCategoryName={newCategoryName}
                            setNewCategoryName={setNewCategoryName}
                        />
                    )}
                </div>
            </div>
        </>
    );
}