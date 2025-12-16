"use client";

import React from "react";
import Image from "next/image";

// Estilos base ajustados para se parecerem exatamente com a imagem
const modalStyles = {
  // O overlay invisível da base (não é visível na imagem, mas necessário para a estrutura)
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // O popup em si
  dialog: {
    width: "280px", // Largura aproximada
    background: "#fdfdfd", // Fundo branco/quase branco
    borderRadius: "20px",
    padding: "30px 20px 20px 20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", // Sombra suave
    textAlign: "center",
    border: "1px solid #eee", // Borda sutil
  },
  // Estilo da mensagem (TOP)
  message: {
    fontSize: "16px",
    fontWeight: "500", // Mais fino
    color: "#333",
    marginBottom: "15px", 
    lineHeight: "1.4",
  },
  // Wrapper para o produto/imagem (MIDDLE)
  imageWrapper: {
    width: "85px", 
    height: "85px",
    borderRadius: "15px",
    backgroundColor: "#fff", 
    boxShadow: "0 0 5px rgba(0,0,0,0.05)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0px auto 25px auto", 
    overflow: "hidden",
    padding: "5px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  // Container para os botões (BOTTOM)
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px", 
    marginTop: "25px", 
  },
  // Botão base
  button: {
    height: "50px",
    borderRadius: "12px", 
    fontSize: "18px",
    fontWeight: "600",
    border: "none",
    width: "100%",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  // Botão Sim (Confirmar) - Escuro
  confirmButton: {
    background: "#333",
    color: "#fff",
    opacity: 1, 
  },
  // Botão Não (Cancelar) - Claro/Inativo
  cancelButton: {
    background: "#e0e0e0",
    color: "#888",
    opacity: 0.8,
  },
};

export default function ConfirmationModal({
  productImage = "/default-product.png", 
  onCancel = () => console.log("Cancelado"),
  onConfirm = () => console.log("Confirmado"),
}) {
  return (
    <div style={modalStyles.overlay}>
      <div className="confirmation-dialog" style={modalStyles.dialog}>
        
        {/* 1. Mensagem centralizada (TOP) */}
        <p style={modalStyles.message}>
          Tem certeza que deseja deletar esse produto?
        </p>

        {/* 2. Imagem do produto (MIDDLE) */}
        <div style={modalStyles.imageWrapper}>
          <Image
            src={productImage} // Se não tiver imagem, vai para a imagem padrão
            alt="Produto"
            width={85} // Define as dimensões fixas
            height={85}
            style={modalStyles.image}
          />
        </div>

        {/* 3. Botões empilhados (BOTTOM) */}
        <div style={modalStyles.buttonContainer}>
          {/* Botão Sim (Confirmar) - Cor Escura */}
          <button 
            style={{ ...modalStyles.button, ...modalStyles.confirmButton }} 
            onClick={onConfirm}
          >
            Sim
          </button>

          {/* Botão Não (Cancelar) - Cor Clara/Inativa */}
          <button 
            style={{ ...modalStyles.button, ...modalStyles.cancelButton }} 
            onClick={onCancel}
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
}
