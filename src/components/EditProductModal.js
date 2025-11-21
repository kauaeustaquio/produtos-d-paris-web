'use client';

import { useState, useEffect } from "react";

export default function EditProductModal({ product, onClose, onSave }) {

    const [form, setForm] = useState({
        nome: "",
        valor: "",
        categoria: "",
        imagem: "",
        emPromocao: false,
        desconto: 0,
    });

    useEffect(() => {
        if (product) setForm(product);
    }, [product]);

    const handleChange = (e) => {
        let { name, value, checked, type } = e.target;
        value = type === "checkbox" ? checked : value;

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(form); // Retorna os dados para o componente pai
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h2>Editar Produto</h2>

                <label>Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} />

                <label>Valor</label>
                <input name="valor" value={form.valor} onChange={handleChange} />

                <label>Categoria</label>
                <input name="categoria" value={form.categoria} onChange={handleChange} />

                <label>Imagem (URL)</label>
                <input name="imagem" value={form.imagem} onChange={handleChange} />

                <label className="checkbox-row">
                    <input 
                        type="checkbox"
                        name="emPromocao"
                        checked={form.emPromocao}
                        onChange={handleChange}
                    />
                    Em Promoção
                </label>

                {form.emPromocao && (
                    <>
                        <label>Desconto (%)</label>
                        <input name="desconto" value={form.desconto} onChange={handleChange} />
                    </>
                )}

                <div className="modal-actions">
                    <button className="btn-save" onClick={handleSubmit}>Salvar</button>
                    <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                </div>

            </div>
        </div>
    );
}
