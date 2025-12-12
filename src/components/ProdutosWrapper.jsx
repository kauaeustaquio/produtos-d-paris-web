"use client";

import React, { useState } from "react";
import ProductFormModal from "@/components/ProductFormModal";

export default function ProdutosWrapper({ produtos, categorias }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState("");
  const [valor, setValor] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagem, setImagem] = useState(null);

  const [desconto, setDesconto] = useState(0);
  const [emPromocao, setEmPromocao] = useState(false);

  const descontosOpcoes = [0, 5, 10, 15, 20, 30, 40, 50];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagem(file);
    setImagemPreview(URL.createObjectURL(file));
  };

  const handleEdit = (produto) => {
    setProdutoEditando(produto);

    setNome(produto.nome);
    setSelectedCategoriaId(String(produto.categoria_id));
    setValor(String(produto.valor));
    setQuantidade(0);
    setImagemPreview(produto.imagem);

    setDesconto(produto.desconto || 0);
    setEmPromocao(produto.em_promocao === true);

    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* REPLICA apenas o EditButton */}
      {produtos.map((p) => (
        <button
          key={p.id}
          onClick={() => handleEdit(p)}
          className="edit-btn"
        >
          Editar
        </button>
      ))}

      {isPopupOpen && (
        <ProductFormModal
          produtoEditando={produtoEditando}
          onClose={handleClose}
          onSave={() => {}}
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
          categoriaObjetos={categorias}
        />
      )}
    </>
  );
}
