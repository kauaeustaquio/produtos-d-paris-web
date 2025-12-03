// src/components/LogoutConfirmation.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
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
    display: 'block',
    zIndex: 1000,
  },
  dialogPosition: {
    position: 'absolute',
    top: '15rem',
    left: '50%',
    transform: 'translateX(-50%)',
  }
};

export default function LogoutConfirmation() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

const handleLogout = async () => {
  await signOut({
    redirect: true,
    callbackUrl: "/telaLogin"
  });

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
      {/* Ícone de Logout que abre o modal */}
      <div 
        onClick={() => setShowModal(true)} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <LogOut size={20} color="#E20909" />
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalStyles.overlay}>
          <div className="confirmation-dialog" style={modalStyles.dialogPosition}>

            <div className="confirmation-message">
              Tem certeza que deseja sair da conta?
            </div>

            <div className="button-container-stack">
              <ActionButton 
                label="Sim" 
                onClick={()=>handleLogout()} 
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
