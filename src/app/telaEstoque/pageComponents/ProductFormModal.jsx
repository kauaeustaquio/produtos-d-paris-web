"use client";

import React from 'react';
import { CircleX, Upload } from "lucide-react";

import { formatarParaBRL, calcularValorComDesconto } from '../utils/formatters';                                                  

export default function ProductFormModal({
    produtoEditando, onClose, onSave,
    // Estados do formulário
    nome, setNome, categoria, setCategoria, valor, setValor, 
    imagemPreview, handleFileChange,
    // Estados de desconto
    desconto, setDesconto, emPromocao, setEmPromocao,
    descontosOpcoes,
    // NOVO PROP: Lista de objetos de categoria vinda do TelaEstoque
    categoriaObjetos 
}) {
    
    // Calcula o novo valor com desconto
    const valorComDesconto = React.useMemo(() => {
        // Se 'valor' for vazio, retorna 0 para evitar erros no cálculo
        if (!valor) return 0;
        return calcularValorComDesconto(valor, desconto);
    }, [valor, desconto]);

    // Validação de formulário
    // A validação da categoria deve ser ajustada para aceitar o ID/nome da categoria
    const isFormValid = nome && categoria && valor; 
    
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
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="" disabled>Selecionar...</option>
                        {/* SUBSTITUIÇÃO DAS OPÇÕES ESTÁTICAS PELAS DINÂMICAS */}
                        {categoriaObjetos.length > 0 ? (
                            categoriaObjetos.map(cat => (
                                // Usamos cat.id no 'value' para enviar a Chave Estrangeira (melhor prática)
                                // Se o seu backend espera o nome (string), use value={cat.nome}
                                <option key={cat.id} value={cat.id}> 
                                    {cat.nome}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>Carregando categorias...</option>
                        )}
                        {/* REMOVIDO: Opções estáticas de categoria (Casa, Carros, etc.) */}
                    </select>

                    <label htmlFor="valor">Valor</label>
                    <input
                        id="valor"
                        type="text"
                        placeholder="Ex: 12,00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />
                    
                    {/* A seção de desconto é relevante apenas para edição na sua lógica original */}
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
                        {produtoEditando ? 'Atualizar' : 'Adicionar'} 
                    </button>
                </div>
            </div>
        </div>
    );
}