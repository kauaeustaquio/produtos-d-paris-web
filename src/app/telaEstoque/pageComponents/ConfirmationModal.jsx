"use client";

import React from 'react';
import { CircleX, CircleCheck } from "lucide-react";

export default function ConfirmationModal({ title, message, onCancel, onConfirm }) {
    return (
        <div className="popup-overlay delete-popup-overlay">
            <div className="popup-content delete-popup-content">
                <h2 className="delete-title">{title}</h2>
                <p className="delete-message">{message}</p>
                <div className="delete-buttons">
                    <button 
                        onClick={onCancel} 
                        className="delete-cancel-btn"
                    >
                        <CircleX size={32} color="#dc3545" />
                        <span>Cancelar</span>
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="delete-confirm-btn"
                    >
                        <CircleCheck size={32} color="#28a745" />
                        <span>Deletar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}