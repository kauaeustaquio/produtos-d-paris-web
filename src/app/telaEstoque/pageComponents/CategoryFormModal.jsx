"use client";

import React from "react";
import { CircleX, Upload } from "lucide-react";
import "./CategoryFormModal.css";

export default function CategoryFormModal({
    onClose,
    onSave,
    newCategoryName,
    setNewCategoryName,
    newCategoryImagePreview,
    handleCategoryFileChange,
}) {
    return (
        <div className="modal-backdrop-category">
            <div className="modal-content-category">

                {/* Botão fechar */}
                <button onClick={onClose} className="close-button-category">
                    <CircleX size={24} />
                </button>

                <h3 className="modal-title-category">Insira / Remova uma categoria</h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                    className="category-form"
                >
                    {/* Upload escondido */}
                    <input
                        type="file"
                        style={{ display: "none" }}
                        id="category-image-upload"
                        accept="image/*"
                        onChange={handleCategoryFileChange}
                    />

                    {/* Área que abre o input */}
                    <div
                        className="image-upload-area"
                        onClick={() =>
                            document.getElementById("category-image-upload").click()
                        }
                    >
                        <div className="upload-placeholder">
                            <Upload size={48} />
                            <p className="upload-text">
                                {newCategoryImagePreview
                                    ? "Imagem selecionada"
                                    : "Selecione a imagem"}
                            </p>
                        </div>

                        {newCategoryImagePreview && (
                            <img
                                src={newCategoryImagePreview}
                                className="category-preview-image"
                                alt="Prévia da categoria"
                            />
                        )}
                    </div>

                    <label htmlFor="categoryName" className="label-category">
                        Nome da categoria:
                    </label>

                    <input
                        id="categoryName"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ex: Carros"
                        className="input-category-name"
                    />

                    <button type="submit" className="confirm-button-category">
                        Confirmar
                    </button>
                </form>
            </div>
        </div>
    );
}
