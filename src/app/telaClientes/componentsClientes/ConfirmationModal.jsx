// components/ConfirmationModal.jsx
import React from 'react';

// Um componente simples de modal que recebe a mensagem e as funções de ação
export default function ConfirmationModal({ cliente, action, onConfirm, onCancel }) {
    if (!cliente) return null; // Não renderiza se não houver cliente para confirmar

    const isActivating = action === 'ativar';
    const actionTarget = isActivating ? 'Ativar (o)' : 'Inativar (a)';
    const clienteName = cliente.nome || 'Nome Não Encontrado';

    // Ação do botão SIM
    const handleConfirm = () => {
        onConfirm(cliente, action); // Chama a função de confirmação passada por props
    };

    return (
        <div className="modal-overlay">
            <div className="confirmation-modal">
                <p className="modal-message">
                    Tem certeza que deseja {actionTarget} Cliente:
                    {/* O nome do cliente agora é um elemento span separado para estilizar como na imagem */}
                    <span className="cliente-nome">"{clienteName}"?</span>
                </p>
                <div className="modal-actions">
                    <button 
                        onClick={handleConfirm} 
                        className={`modal-button btn-yes`} // Mantemos apenas btn-yes
                    >
                        Sim
                    </button>
                    <button 
                        onClick={onCancel} 
                        className="modal-button btn-no"
                    >
                        Não
                    </button>
                </div>
            </div>
        </div>
    );
}