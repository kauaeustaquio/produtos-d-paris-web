"use client";

import { useState } from "react";

export default function TelaEstoque() {
  const [popupAberto, setPopupAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [imagem, setImagem] = useState(null);

  const abrirPopup = () => setPopupAberto(true);
  const fecharPopup = () => setPopupAberto(false);

  const enviarProduto = async () => {
    // Validação mínima
    if (!nome || !categoria || !valor) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const data = { nome, categoria, valor: Number(valor), imagem };

    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Produto adicionado com sucesso!");
        fecharPopup();
        // Aqui você pode atualizar a lista de produtos
      } else {
        const errorData = await res.json();
        alert("Erro ao adicionar produto: " + (errorData.error || "Erro desconhecido"));
      }
    } catch (err) {
      console.error("Erro ao enviar produto:", err);
      alert("Erro ao adicionar produto");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gerenciar Estoque</h1>
      <button onClick={abrirPopup}>Novo Produto</button>

      {popupAberto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", width: "400px" }}>
            <h2>Adicionar Produto</h2>
            <button onClick={fecharPopup} style={{ float: "right" }}>X</button>
            <div>
              <input
                type="text"
                placeholder="Nome do produto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Selecione a categoria</option>
                <option value="Perfumaria">Perfumaria</option>
                <option value="Limpeza de Piscina">Limpeza de Piscina</option>
                <option value="Limpeza para Carros">Limpeza para Carros</option>
                <option value="Limpeza para Casa">Limpeza para Casa</option>
              </select>
            </div>
            <div>
              <input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div>
              <input
                type="file"
                onChange={(e) => setImagem(e.target.files[0]?.name)}
              />
            </div>
            <button onClick={enviarProduto}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}
