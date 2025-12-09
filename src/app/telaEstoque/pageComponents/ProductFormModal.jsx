"use client";

import React from 'react';
import { CircleX, Upload } from "lucide-react";

import { formatarParaBRL, calcularValorComDesconto } from '../utils/formatters'; 

export default function ProductFormModal({
    produtoEditando, onClose, onSave,
    nome, setNome,
    selectedCategoriaId, setSelectedCategoriaId,
    valor, setValor,

    quantidade, setQuantidade,   // <-- ADICIONADO

    imagemPreview, handleFileChange,
    desconto, setDesconto, emPromocao, setEmPromocao,
    descontosOpcoes,
    categoriaObjetos
}) {

    // Calcula o novo valor com desconto
    const valorComDesconto = React.useMemo(() => {
        if (!valor) return 0;
        return calcularValorComDesconto(valor, desconto);
    }, [valor, desconto]);

    // Validação do formulário
    const isFormValid = nome && selectedCategoriaId && valor;

    const handleDiscountChange = (newDesconto) => {
        const newDesc = parseInt(newDesconto);
        setDesconto(newDesc);
        setEmPromocao(newDesc > 0);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>
                    <CircleX size={28} color="#aaa" />
                </button>
                
                <div className="popup-left">
                    <label className="upload-label">
                        <input type="file" onChange={handleFileChange} />

                        {imagemPreview ? (
                            <img 
                                src={imagemPreview} 
                                alt="Pré-visualização do produto"
                                className="uploaded-image-preview" 
                            />
                        ) : (
                            <>
                                <Upload size={48} color="#888" />
                                <span>Selecione a imagem do produto</span>
                            </>
                        )}
                    </label>
                </div>
                
                <div className="popup-right">
                    
                    <label htmlFor="nome">Nome do produto:</label>
                    <input
                        id="nome"
                        type="text"
                        placeholder="Ex. Veja Limpeza Multiuso 500ml"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <label htmlFor="categoria">Categoria</label>
                    <select
                        id="categoria"
                        value={String(selectedCategoriaId)}
                        onChange={(e) => setSelectedCategoriaId(e.target.value)}
                    >
                        <option value="" disabled>Selecionar...</option>

                        {categoriaObjetos.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="valor">Valor</label>
                    <input
                        id="valor"
                        type="text"
                        placeholder="Ex: 12,00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />

                    {/* CAMPO DE QUANTIDADE */}
                    <label htmlFor="quantidade">Quantidade</label>
                    <input
                        id="quantidade"
                        type="number"
                        placeholder={produtoEditando ? "Adicionar quantidade" : "Estoque inicial"}
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                    />

                    {/* Desconto apenas quando editar */}
                    {(produtoEditando || desconto > 0) && (
                        <>
                            <label htmlFor="desconto">Desconto ({desconto}%)</label>
                            <select
                                id="desconto"
                                value={desconto}
                                onChange={(e) => handleDiscountChange(e.target.value)}
                                className={emPromocao ? 'em-promocao-select' : ''}
                            >
                                {descontosOpcoes.map(d => (
                                    <option key={d} value={d}>{d}%</option>
                                ))}
                            </select>

                            <p className="promocao-status">
                                Status: {emPromocao ?
                                    `Em Promoção. Novo Valor: ${formatarParaBRL(valorComDesconto)}` :
                                    `Promoção Inativa. Valor Original: ${formatarParaBRL(valorComDesconto)}`
                                }
                            </p>
                        </>
                    )}

                    <button
                        onClick={onSave}
                        className={`submit-btn ${isFormValid ? "enabled" : ""}`}
                        disabled={!isFormValid}
                    >
                        {produtoEditando ? "Atualizar" : "Adicionar"}
                    </button>

                </div>
            </div>
        </div>
    );
}
