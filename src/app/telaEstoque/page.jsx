"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CircleX, Search, Trash2, Pencil, CircleCheck } from "lucide-react";
import "./style.css";

import ProductTableRow from "./pageComponents/ProductTableRow";
import ProductFormModal from "./pageComponents/ProductFormModal";
import ConfirmationModal from "./pageComponents/ConfirmationModal";
import FilterAndStatsBar from "./pageComponents/FilterAndStatsBar";
import CategoryFormModal from "./pageComponents/CategoryFormModal";
import { useBlobUrlCleanup } from "./utils/useBlobUrlCleanup";
import { formatarParaBRL, calcularValorComDesconto } from "./utils/formatters";

export default function TelaEstoque() {
  const [popupAberto, setPopupAberto] = useState(false);
  const [nome, setNome] = useState("");
  // Mantemos como string no input, mas convertimos antes de enviar
  const [selectedCategoriaId, setSelectedCategoriaId] = useState("");
  const [valor, setValor] = useState("");

  const [imagem, setImagem] = useState(null); // File
  const [imagemPreview, setImagemPreview] = useState(null); // URL (blob ou servidor)

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

  // Categoria
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

  // Limpeza de blob URLs geradas por este componente
  useBlobUrlCleanup(imagemPreview);
  useBlobUrlCleanup(newCategoryImagePreview);

  // --- CATEGORIAS ---
  const fetchCategorias = async () => {
    try {
      const res = await fetch("/api/categorias");
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      const data = await res.json();
      // Espera-se array de objetos { id, nome, imagem_url }
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
    if (!newCategoryName.trim() || !newCategoryImage) {
      alert("Preencha o nome e selecione uma imagem para a categoria.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", newCategoryName.trim());
    formData.append("imagem", newCategoryImage);

    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        body: formData,
      });

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

  // --- PRODUTOS ---
  const fecharPopup = () => {
    // revogar somente se for blob URL
    if (imagemPreview && typeof imagemPreview === "string" && imagemPreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagemPreview);
      } catch (e) {
        // noop
      }
    }

    setPopupAberto(false);
    setProdutoEditando(null);
    setNome("");
    setSelectedCategoriaId("");
    setValor("");
    setImagem(null);
    setImagemPreview(null);
    setDesconto(0);
    setEmPromocao(false);
  };

  const abrirPopupAdicionar = () => {
    setProdutoEditando(null);
    setNome("");
    setSelectedCategoriaId("");
    setValor("");
    setImagem(null);
    setImagemPreview(null);
    setDesconto(0);
    setEmPromocao(false);
    setPopupAberto(true);
  };

  const abrirPopupEdicao = (produto) => {
    setProdutoEditando(produto);

    setNome(produto?.nome || "");
    setSelectedCategoriaId(produto?.categoria_id != null ? String(produto.categoria_id) : "");
    setValor(produto?.valor != null ? String(produto.valor).replace('.', ',') : "");

    setImagem(null);
    // produto.imagem pode ser URL absoluta (servidor) ou blob url. Protegemos contra undefined
    if (produto?.imagem) setImagemPreview(produto.imagem);
    else setImagemPreview(null);

    const desc = produto?.desconto || 0;
    setDesconto(desc);
    setEmPromocao(Boolean(desc > 0));
    setPopupAberto(true);
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0] || null;

    if (file) {
      // Se havia um preview blob anterior, revoga
      if (imagemPreview && typeof imagemPreview === "string" && imagemPreview.startsWith("blob:")) {
        try { URL.revokeObjectURL(imagemPreview); } catch (e) { /* noop */ }
      }

      setImagem(file);
      const fileURL = URL.createObjectURL(file);
      setImagemPreview(fileURL);
    } else {
      if (imagemPreview && typeof imagemPreview === "string" && imagemPreview.startsWith("blob:")) {
        try { URL.revokeObjectURL(imagemPreview); } catch (e) { /* noop */ }
      }
      setImagem(null);
      setImagemPreview(null);
    }
  };

  const handleSaveProduct = async () => {
    // Valida campos obrigatórios
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
    // envia como número — a API deve aceitar tanto string quanto número, mas garantimos que seja number
    formData.append('categoriaId', Number(selectedCategoriaId));
    formData.append('valor', valorNumerico);
    formData.append('desconto', Number(desconto) || 0);
    // envia emPromocao como string para evitar ambiguidades com FormData
    formData.append('emPromocao', emPromocao ? 'true' : 'false');

    // Imagem: anexa somente se for um File (novo upload)
    if (imagem instanceof File) {
      formData.append('imagem', imagem);
    }

    if (produtoEditando) {
      formData.append('id', produtoEditando.id);
    }

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

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

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    // Recarrega quando searchTerm, filtro ativo ou o conteúdo das categorias mudar
    fetchProdutos();
  }, [searchTerm, activeFilter, JSON.stringify(categoriaObjetos)]);

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
              <span className="col-valor">Valor</span>
              <span className="col-actions"></span>
            </div>

            {loading ? (
              <p>Carregando...</p>
            ) : produtos.length > 0 ? (
              <ul className="product-list">
                {produtos.map((produto) => (
                  <ProductTableRow key={produto.id} produto={produto} onEdit={abrirPopupEdicao} onDelete={handleDeleteClick} />
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
