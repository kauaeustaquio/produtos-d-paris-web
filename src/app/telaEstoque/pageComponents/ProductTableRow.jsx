import React from 'react';
import Image from "next/image";
import { Trash2, Pencil } from "lucide-react";

import { formatarParaBRL, calcularValorComDesconto } from '../utils/formatters';

// 🔥 ADICIONE ESTA CONSTANTE AQUI:
const defaultImageUrl = "/default-product.png";

export default function ProductTableRow({ produto, onEdit, onDelete }) {

    const valorComDesconto = calcularValorComDesconto(produto.valor, produto.desconto);

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

            <span className="col-categoria-item">
            {produto.categoria_nome}
            </span>


            <span className={`col-valor-item ${produto.emPromocao && produto.desconto > 0 ? 'promo-price' : ''}`}>
                {produto.emPromocao && produto.desconto > 0 ? (
                    <>
                        <del>{formatarParaBRL(produto.valor)}</del>
                        <br/>
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
