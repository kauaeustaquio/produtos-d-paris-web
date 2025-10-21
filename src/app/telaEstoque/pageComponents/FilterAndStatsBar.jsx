"use client";

import React from 'react';
import { Search } from "lucide-react";

export default function FilterAndStatsBar({ 
    searchTerm, setSearchTerm, produtosCount, 
    isFilterPopupOpen, setIsFilterPopupOpen, 
    activeFilter, handleFilterClick, categoriasFiltro, 
    onAddProduct 
}) {
    return (
        <div className="controls-bar">
            <div className="search-container">
                <Search size={20} color="#888" />
                <input
                    type="text"
                    placeholder="Pesquisar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            
            <div className="stats-container">
                <span>{produtosCount} produtos foram <br/> cadastrados</span>
            </div>
            
            <div className="filter-container">
                <a href="#" className="filter-link" onClick={() => setIsFilterPopupOpen(true)}>
                    <img src="/img/Filter.png" alt="Ícone de Filtro" />
                    <span>Filtrar</span>
                </a>

                {isFilterPopupOpen && (
                    <div className="filter-popup-content-positioned">
                        <button className="filter-close-btn" onClick={() => setIsFilterPopupOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <h2>Selecionar...</h2>
                        <div className="filter-button-group">
                            {categoriasFiltro.map((category) => (
                                <button
                                    key={category}
                                    className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <a href="#" className="categories-link">
                <img src="/img/Categorias.png" alt="Ícone de Categorias" />
                <span>Categorias</span>
            </a>

            <button className="new-product-btn" onClick={onAddProduct}>
                <span className="btn-text">Novo produto</span>
                <img src="/img/adicionar-botao.png" alt="Ícone de adicionar" />
            </button>
        </div>
    );
}