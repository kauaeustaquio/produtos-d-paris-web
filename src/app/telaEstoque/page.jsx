"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CircleX, Search, Trash2, Pencil, CircleCheck } from "lucide-react";
import "./style.css";

import CategoryPage from "./pageComponents/CategoryPage";
import ProductTableRow from "./pageComponents/ProductTableRow";
import ProductFormModal from "./pageComponents/ProductFormModal";
import ConfirmationModal from "./pageComponents/ConfirmationModal";
import FilterAndStatsBar from "./pageComponents/FilterAndStatsBar";
import CategoryFormModal from "./pageComponents/CategoryFormModal";
import { useBlobUrlCleanup } from "./utils/useBlobUrlCleanup";
import { formatarParaBRL, calcularValorComDesconto } from "./utils/formatters";

export default function TelaEstoque() {
  const [isDeleteCategoryPopupOpen, setIsDeleteCategoryPopupOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [popupAberto, setPopupAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState("");
  const [valor, setValor] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [desconto, setDesconto] = useState(0);
  const [emPromocao, setEmPromocao] = useState(false);

  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);

  const [categoriaObjetos, setCategoriaObjetos] = useState([]);
  const [categoriasFiltro, setCategoriasFiltro] = useState(["Todos"]);

  const descontosOpcoes = useMemo(() => {
    const options = [];
    for (let i = 0; i <= 100; i += 5) options.push(i);
    return options;
  }, []);

  useBlobUrlCleanup(imagemPreview);
  useBlobUrlCleanup(newCategoryImagePreview);

  // --- Funções de popup de produto adicionadas ---
  const abrirPopupAdicionar = () => {
    setPopupAberto(true);
    setProdutoEditando(null);
    setNome("");
    setSelectedCategoriaId("");
    setValor("");
    setQuantidade("");
    setImagem(null);
    setImagemPreview(null);
    setDesconto(0);
    setEmPromocao(false);
  };

  const abrirPopupEdicao = (produto) => {
    setProdutoEditando(produto);
    setNome(produto.nome);
    setSelectedCategoriaId(produto.categoriaId);
    setValor(produto.valor);
    setQuantidade(0);
    setImagem(null);
    setImagemPreview(produto.imagem_url || null);
    setDesconto(produto.desconto || 0);
    setEmPromocao(produto.emPromocao || false);
    setPopupAberto(true);
  };

  const fecharPopup = () => {
    setPopupAberto(false);
    setProdutoEditando(null);
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0] || null;
    setImagem(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagemPreview(url);
    } else {
      if (imagemPreview && imagemPreview.startsWith("blob:")) URL.revokeObjectURL(imagemPreview);
      setImagemPreview(null);
    }
  };

  // --- CATEGORIAS ---
  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias");
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      const data = await res.json();
      setCategoriaObjetos(data || []);
      setCategoriasFiltro(["Todos", ...(data || []).map((c) => c.nome)]);
    } catch (error) {
      console.error("Falha ao buscar categorias:", error);
      setCategoriaObjetos([]);
      setCategoriasFiltro(["Todos"]);
    }
  };

  const openCategoryPopup = () => {
    setNewCategoryName("");
    setNewCategoryImage(null);
    if (newCategoryImagePreview && typeof newCategoryImagePreview === "string" && newCategoryImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(newCategoryImagePreview);
    }
    setNewCategoryImagePreview(null);
    setIsCategoryPopupOpen(true);
  };

  const closeCategoryPopup = () => {
    setNewCategoryName("");
    setNewCategoryImage(null);
    if (newCategoryImagePreview && typeof newCategoryImagePreview === "string" && newCategoryImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(newCategoryImagePreview);
    }
    setNewCategoryImagePreview(null);
    setIsCategoryPopupOpen(false);
  };

  const handleCategoryFileChange = (e) => {
    const file = e?.target?.files?.[0] || null;
    if (file) {
      setNewCategoryImage(file);
      const fileURL = URL.createObjectURL(file);
      setNewCategoryImagePreview(fileURL);
    } else {
      if (newCategoryImagePreview && typeof newCategoryImagePreview === "string" && newCategoryImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(newCategoryImagePreview);
      }
      setNewCategoryImage(null);
      setNewCategoryImagePreview(null);
    }
  };

  const handleSaveCategory = async () => {
    const nomeLimpo = newCategoryName.trim();
    if (!nomeLimpo) {
      alert("Insira um nome para a categoria.");
      return;
    }
    const categoriaExistente = categoriaObjetos.find(c => c.nome.toLowerCase() === nomeLimpo.toLowerCase());
    if (categoriaExistente) {
      setCategoryToDelete(categoriaExistente);
      setIsDeleteCategoryPopupOpen(true);
      return;
    }
    if (!newCategoryImage) {
      alert("Selecione uma imagem para a categoria.");
      return;
    }
    const formData = new FormData();
    formData.append("nome", nomeLimpo);
    formData.append("imagem", newCategoryImage);
    try {
      const res = await fetch("/api/categorias", { method: "POST", body: formData });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Erro desconhecido." }));
        throw new Error(errorData.detail || errorData.message || res.statusText);
      }
      closeCategoryPopup();
      await fetchCategorias();
    } catch (error) {
      console.error("Falha ao adicionar categoria:", error);
      alert(`Não foi possível adicionar a categoria. Detalhe: ${error.message}`);
    }
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await fetch(`/api/categorias?id=${categoryToDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Erro desconhecido." }));
        throw new Error(errorData.message || "Erro ao deletar");
      }
      setIsDeleteCategoryPopupOpen(false);
      setCategoryToDelete(null);
      await fetchCategorias();
    } catch (e) {
      alert("Não foi possível excluir a categoria.");
    }
  };

  const handleDeleteCategoryCancel = () => {
    setIsDeleteCategoryPopupOpen(false);
    setCategoryToDelete(null);
  };

  // --- PRODUTOS ---
 const handleSaveProduct = async () => {
  if (!nome.trim() || !selectedCategoriaId || !valor) {
    alert("Preencha todos os campos e selecione uma categoria.");
    return;
  }
  const valorNumerico = parseFloat(String(valor).replace(',', '.'));
  if (isNaN(valorNumerico)) {
    alert('Valor inválido.');
    return;
  }
  if (!produtoEditando && !imagem) {
    alert("Selecione uma imagem para o novo produto!");
    return;
  }

  const method = produtoEditando ? 'PUT' : 'POST';
  const url = produtoEditando ? `/api/produtos/${produtoEditando.id}` : '/api/produtos';
  
  const formData = new FormData();
  formData.append('nome', nome.trim());
  formData.append('categoriaId', Number(selectedCategoriaId));
  formData.append('valor', valorNumerico);
  let quantidadeFinal = produtoEditando ? (Number(produtoEditando.quantidade) || 0) + (Number(quantidade) || 0) : Number(quantidade) || 0;
  formData.append('quantidade', quantidadeFinal);
  formData.append('desconto', Number(desconto) || 0);
  formData.append('emPromocao', emPromocao ? 'true' : 'false');

  // Verifica se a imagem é do tipo File e anexa ao FormData
  if (imagem instanceof File) formData.append('imagem', imagem);
  
  if (produtoEditando) formData.append('id', produtoEditando.id);

  try {
    const res = await fetch(url, { method, body: formData });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
      throw new Error(errorData.detail || errorData.message || res.statusText);
    }
    fecharPopup();
    await fetchProdutos();
  } catch (error) {
    console.error(`Falha ao ${produtoEditando ? 'atualizar' : 'adicionar'} produto:`, error);
    alert(`Não foi possível ${produtoEditando ? 'atualizar' : 'adicionar'} o produto. Detalhe: ${error.message}`);
  }
};


  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (activeFilter && activeFilter !== 'Todos') params.append('category', activeFilter);
      const res = await fetch(`/api/produtos?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao buscar produtos');
      const data = await res.json();
      setProdutos(data || []);
    } catch (error) {
      console.error('Falha ao buscar produtos:', error);
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
      const res = await fetch(`/api/produtos/${productToDelete}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
        throw new Error(errorData.message || res.statusText);
      }
      setIsDeletePopupOpen(false);
      setProductToDelete(null);
      await fetchProdutos();
    } catch (error) {
      console.error('Falha ao deletar produto:', error);
      alert(`Não foi possível deletar o produto. Tente novamente. Detalhe: ${error.message}`);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeletePopupOpen(false);
    setProductToDelete(null);
  };

  useEffect(() => { fetchCategorias(); }, []);
  useEffect(() => { fetchProdutos(); }, [searchTerm, activeFilter, JSON.stringify(categoriaObjetos)]);

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
            <img src="/img/usuario-icone-branco.png" alt="Usuário" />
          </a>
        </div>
      </div>

      <div className="main-content">
        <div className="stock-container">
          <header className="stock-header">
            <img src="/img/estoque-icone.png" alt="Ícone de Estoque" />
            <h1>Gerenciar estoque</h1>
          </header>

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
            onAddCategory={openCategoryPopup}
          />

          <div className="product-table-container">
            <div className="product-table-header">
              <span className="col-checkbox"></span>
              <span className="col-produto">Produtos</span>
              <span className="col-categoria">Categoria</span>
              <span className="col-quantidade">Quantidade</span> 
              <span className="col-valor">Valor</span>
              <span className="col-actions"></span>
            </div>

            {loading ? (
              <p>Carregando...</p>
            ) : produtos.length > 0 ? (
              <ul className="product-list">
                {produtos.map((produto) => (
                  <ProductTableRow 
                    key={produto.id} 
                    produto={produto} 
                    onEdit={abrirPopupEdicao} 
                    onDelete={handleDeleteClick}
                    categorias={categoriaObjetos}
                  />
                ))}
              </ul>
            ) : (
              <p className="no-products-message">Nenhum produto encontrado.</p>
            )}
          </div>

          {popupAberto && (
            <ProductFormModal
              produtoEditando={produtoEditando}
              onClose={fecharPopup}
              onSave={handleSaveProduct}
              nome={nome}
              setNome={setNome}
              selectedCategoriaId={selectedCategoriaId}
              setSelectedCategoriaId={setSelectedCategoriaId}
              valor={valor}
              setValor={setValor}
              quantidade={quantidade}
              setQuantidade={setQuantidade} 
              imagemPreview={imagemPreview}
              handleFileChange={handleFileChange}
              desconto={desconto}
              setDesconto={setDesconto}
              emPromocao={emPromocao}
              setEmPromocao={setEmPromocao}
              descontosOpcoes={descontosOpcoes}
              categoriaObjetos={categoriaObjetos}
            />
          )}

          {isDeletePopupOpen && (
            <ConfirmationModal
              title="Tem certeza que deseja deletar este produto?"
              message="Essa ação não pode ser desfeita."
              onCancel={handleDeleteCancel}
              onConfirm={handleDeleteConfirm}
            />
          )}

          {isDeleteCategoryPopupOpen && (
            <ConfirmationModal
              title="Categoria já existe"
              message={`A categoria "${categoryToDelete?.nome}" já existe. Deseja removê-la?`}
              onCancel={handleDeleteCategoryCancel}
              onConfirm={handleDeleteCategoryConfirm}
            />
          )}

          {isCategoryPopupOpen && (
            <CategoryFormModal
              onClose={closeCategoryPopup}
              onSave={handleSaveCategory}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              newCategoryImagePreview={newCategoryImagePreview}
              handleCategoryFileChange={handleCategoryFileChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
