"use client";

export default function ConfirmPopup({ onCancel, onConfirm }) {
  return (
    <div className="popup-overlay">
      <div className="popup-container confirmation-content">
        <p className="titulo-confirmacao">
          Confirmar alteração?
        </p>

        <div className="button-group">
          <button
            onClick={onCancel}
            className="cancel-button"
          >
            ✕
          </button>

          <button
            onClick={onConfirm}
            className="confirm-button"
          >
            ✔
          </button>
        </div>
      </div>
    </div>
  );
}
