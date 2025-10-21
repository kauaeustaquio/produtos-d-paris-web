// components/StatusToggleButton.jsx
// O código da API toggleClienteStatus foi movido para TelaClientes para ficar junto com a lógica do modal.

import React from "react";

// O componente agora recebe onConfirmRequest como prop
export default function StatusToggleButton({ cliente, onConfirmRequest }) {
    // Determina qual ação o botão deve solicitar
    const action = cliente.status_ativo ? 'inativar' : 'ativar'; 

    const handleClick = () => {
        // Chama a função do pai, que abrirá o modal
        onConfirmRequest(cliente, action);
    };

    const buttonText = action === 'ativar' ? 'ATIVAR' : 'INATIVAR';
    const buttonClass = action === 'ativar' ? 'btn-activate' : 'btn-inactivate';

    return (
        <button 
            onClick={handleClick}
            className={`action-button ${buttonClass}`}
        >
            {buttonText}
        </button>
    );
};