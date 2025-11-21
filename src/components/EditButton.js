'use client';

import { Pencil } from "lucide-react";
import { useState } from "react";
import EditProductModal from "./EditProductModal";

export default function EditButton({ produto }) {
    const [open, setOpen] = useState(false);

    const handleEditClick = (e) => {
        e.preventDefault();
        setOpen(true); // Abre o popup
    };

    return (
        <>
            <button 
                onClick={handleEditClick}
                className="edit-icon-link"
                title={`Editar Produto ID ${produto.id}`}
            >
                <Pencil className="pencil-icon" />
            </button>

            {open && (
                <EditProductModal
                    product={produto}
                    onClose={() => setOpen(false)}
                    onSave={(dadosAtualizados) => {
                        console.log("Enviar para API:", dadosAtualizados);
                        setOpen(false);
                    }}
                />
            )}
        </>
    );
}
