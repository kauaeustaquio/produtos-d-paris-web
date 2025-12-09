"use client";

import React, { useState } from "react";
import { CircleX, Upload, Trash2, CircleCheck } from "lucide-react";
import ToastNotification from "@/components/ToastNotification";
import "./CategoryFormModal.css";

export default function CategoryFormModal({
    mode = "add",
    onClose,
    onSave,
    onDelete,
    categories = [],
    newCategoryName,
    setNewCategoryName,
    newCategoryImagePreview,
    handleCategoryFileChange,
}) {
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const handleSaveClick = async () => {
        try {
            const result = await onSave(); // onSave deve retornar JSON da API

            if (result?.error) {
                setToastType("error");
                setToastMessage(result.error);
                return;
            }

            setToastType("success");
            setToastMessage("Categoria salva com sucesso!");
        } catch (err) {
            setToastType("error");
            setToastMessage(err?.message || "Erro ao salvar categoria!");
        }
    };

    const handleDeleteClick = async () => {
        try {
            const result = await onDelete(newCategoryName); // onDelete deve retornar JSON da API

            if (result?.error) {
                setToastType("error");
                setToastMessage(result.error);
                return;
            }

            setToastType("success");
            setToastMessage("Categoria removida com sucesso!");
        } catch (err) {
            setToastType("error");
            setToastMessage(err?.message || "Erro ao remover categoria!");
        }
    };

    return (
        <>
            <div className="modal-backdrop-category">
                <div className="modal-content-category">

                    {/* Botão fechar */}
                    <button onClick={onClose} className="close-button-category">
                        <CircleX size={24} />
                    </button>

                    <h3 className="modal-title-category">
                        {mode === "add" ? "Adicionar categoria" : "Remover categoria"}
                    </h3>

                    {/* MODO ADICIONAR */}
                    {mode === "add" && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveClick();
                            }}
                            className="category-form"
                        >
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="category-image-upload"
                                accept="image/*"
                                onChange={handleCategoryFileChange}
                            />

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
                                <CircleCheck size={18} /> Confirmar
                            </button>
                        </form>
                    )}

                    {/* MODO REMOVER */}
                    {mode === "delete" && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleDeleteClick();
                            }}
                            className="category-form"
                        >
                            <label className="label-category">
                                Selecione a categoria para remover:
                            </label>

                            <select
                                className="input-category-name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nome}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="confirm-button-category delete-mode"
                            >
                                <Trash2 size={18} /> Confirmar
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Toast notification */}
            <ToastNotification type={toastType} message={toastMessage} />
        </>
    );
}
