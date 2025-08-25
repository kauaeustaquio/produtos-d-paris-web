"use client";

import { useState } from "react";
import "./style.css";
import { 
  CircleX, 
  CirclePlus,
  Upload,
} from "lucide-react";


export default function TelaEstoque() {
  const [popupAberto, setPopupAberto] = useState(false);
  
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [imagem, setImagem] = useState(null);

  const abrirPopup = () => setPopupAberto(true);
  const fecharPopup = () => setPopupAberto(false);

  const enviarProduto = async () => {
    if (!nome || !categoria || !valor) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, categoria, valor, imagem }),
      });

      if (!res.ok) {
        throw new Error('Erro ao adicionar produto');
      }

      console.log("Produto adicionado com sucesso!");
      fecharPopup();
    } catch (error) {
      console.error("Falha ao enviar produto:", error);
      alert("Não foi possível adicionar o produto. Tente novamente.");
    }
  };
  
  const isFormValid = nome && categoria && valor;

  return (
    <>
      <div className="top-bar">
        <a href="telaInfo" className="info-icon">
          {/* Altere para uma imagem de ícone branco, por exemplo, info-branco.png */}
          <img src="/img/info-botao.png" alt="Informações" /> 
        </a>
      </div>
      
      {/* O container principal que empurra o conteúdo para baixo */}
      <div className="main-content"> 
        <div className="stock-container">
          <header className="stock-header">
            <img src="/img/estoque-icone.png"/>
            <h1>Gerenciar estoque</h1>
          </header>

          <div className="controls-bar">
            <button className="new-product-btn" onClick={abrirPopup}>
              <span className="btn-text">Novo produto</span>
              <CirclePlus size={40} color="rgb(173, 173, 173)" />
            </button>
          </div>

          {popupAberto && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button className="close-btn" onClick={fecharPopup}>
                  <CircleX size={28} color="#aaa" />
                </button>
                
                <div className="popup-left">
                  <label className="upload-label">
                    <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
                    <Upload size={48} color="#888" />
                    <span>Selecione a imagem do produto</span>
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
                    <option value="--">-</option>
                  </select>

                  <label htmlFor="valor">Valor</label>
                  <input
                    id="valor"
                    type="text"
                    placeholder="Ex: R$ 12,00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />

                  <button
                    onClick={enviarProduto}
                    className={`submit-btn ${isFormValid ? "enabled" : ""}`}
                    disabled={!isFormValid}
                  >
                    Enviar
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