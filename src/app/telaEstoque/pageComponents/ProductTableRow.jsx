import React from 'react';
import Image from "next/image";
import { Trash2, Pencil } from "lucide-react";

import { formatarParaBRL, calcularValorComDesconto } from '../utils/formatters';

const defaultImageUrl = "/default-product.png";

export default function ProductTableRow({ produto, onEdit, onDelete }) {

    // valor com desconto (se houver)
    const valorComDesconto = calcularValorComDesconto(produto.valor, produto.desconto);

    // fallback para o nome da categoria (aceita nome_categoria ou categoria_nome)
    const nomeCategoria = produto.nome_categoria ?? produto.categoria_nome ?? produto.nomeCategoria ?? "—";

    // quantidade (garante número)
    const quantidade = (produto.quantidade != null) ? Number(produto.quantidade) : 0;

    return (
        <li key={produto.id} className="product-item">
            <div className="product-details-group">
                <div className="product-image-card">
                    <Image
                        src={
                            (typeof produto.imagem === 'string' && produto.imagem)
                                ? produto.imagem
                                : defaultImageUrl
                        }
                        width={80}
                        height={80}
                        alt={produto.nome}
                        className="product-image"
                    />
                </div>

                <div className="product-details-text">
                    <h3>{produto.nome}</h3>
                    {produto.emPromocao && produto.desconto > 0 && (
                        <span className="promotion-tag">🔥 {produto.desconto}% OFF</span>
                    )}
                </div>
            </div>

            {/* Categoria */}
            <span className="col-categoria-item">
                {nomeCategoria}
            </span>

            {/* Quantidade */}
            <span className="col-quantidade-item">
                {quantidade}
            </span>

            {/* Valor (com lógica de promoção) */}
            <span className={`col-valor-item ${produto.emPromocao && produto.desconto > 0 ? 'promo-price' : ''}`}>
                {produto.emPromocao && produto.desconto > 0 ? (
                    <>
                        <del>{formatarParaBRL(produto.valor)}</del>
                        <br />
                        <strong>{formatarParaBRL(valorComDesconto)}</strong>
                    </>
                ) : (
                    formatarParaBRL(produto.valor)
                )}
            </span>

            <div className="product-actions">
                <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(produto.id)}
                >
                    <Trash2 size={24} color="#000" />
                </button>

                <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(produto)}
                >
                    <Pencil size={24} color="#000" />
                </button>
            </div>
        </li>
    );
}
