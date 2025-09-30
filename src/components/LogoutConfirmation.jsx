// src/components/LogoutConfirmation.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

// Estilos embutidos para o OVERLAY e POSICIONAMENTO.
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    
    // Removemos o display flex/justify-content: center para posicionamento manual
    display: 'block', 
    zIndex: 1000,
  },
  
  // Posição para replicar a imagem: ligeiramente para cima e centralizado horizontalmente.
  dialogPosition: {
    position: 'absolute',
    
    // Ajuste fino para posicionar o modal sobre o campo de senha/telefone
    // 15rem (240px) do topo parece estar na área correta.
    top: '15rem', 
    
    // Centralização horizontal do modal:
    left: '50%',
    transform: 'translateX(-50%)', 
  }
};

export default function LogoutConfirmation() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Lógica para limpar informações e deslogar
    localStorage.removeItem('userToken'); 
    localStorage.removeItem('userInfo');
    
    // 2. Redirecionar para a tela de Login
    router.push('/telaLogin');
    setShowModal(false); 
  };
  
  const ActionButton = ({ label, onClick }) => {
    return (
      <button 
        className="confirmation-btn" 
        onClick={onClick}
      >
        {label}
      </button>
    );
  };


  return (
    <>
      {/* Ícone de Logout que aciona o modal */}
      <div 
        onClick={() => setShowModal(true)} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <LogOut size={20} color="#E20909" /> 
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div style={modalStyles.overlay}>
          {/* Aplica a posição do modal usando o estilo inline 'dialogPosition' */}
          <div className="confirmation-dialog" style={modalStyles.dialogPosition}>
            
            <div className="confirmation-message">
              Tem certeza que deseja sair da conta?
            </div>
            
            <div className="button-container-stack">
              <ActionButton 
                label="Sim" 
                onClick={handleLogout} 
              />
              <ActionButton 
                label="Não" 
                onClick={() => setShowModal(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}