"use client";

export default function CategoryPage({ onAddCategory }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <button 
                type="button"
                className="btn-add-category"
                onClick={onAddCategory}
            >
                Nova Categoria
            </button>
        </div>
    );
}
