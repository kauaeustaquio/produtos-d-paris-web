"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import "./style.css";

export default function TelaEstoque() {
    // Estados para a barra de pesquisa e a contagem de clientes
    const [searchTerm, setSearchTerm] = useState("");
    const [clientes, setClientes] = useState([]); // Variável de exemplo para a contagem

    return (
        <>
            <div className="top-bar">
                {/* 1. Elemento da Esquerda: Home */}
                <a href="/telaPrincipal" className="home-botao">
                    <img src="/img/home-botao.png" alt="Ícone de Home" style={{ width: '40px', height: '40px' }} />
                </a>
                
                {/* 2. Elemento da Direita: Grupo de Info e Usuário */}
                <div className="right-icons-group"> 
                    {/* Ícone de Informações (primeiro do grupo) */}
                    <a href="telaInfo" className="info-icon">
                        <img src="/img/info-botao.png" alt="Ícone de Informações" style={{ width: '40px', height: '40px' }} />
                    </a>
                    
                    {/* Ícone do Usuário (segundo do grupo) */}
                    <a href="telaUsuario" className="user-icon">
                        <img src="/img/usuario-icone-branco.png" alt="Usuário"/>
                    </a>
                </div>
            </div>
            
            <div className="main-content">
                <div className="stock-container">
                    <header className="stock-header">
                        <img src="/img/clientes.png" alt="Ícone de Clientes" style={{ width: '60px', height: '60px' }} />
                        <h1>Clientes</h1>
                    </header>

                    {/* Barra de pesquisa e contagem de clientes inseridas aqui */}
                    <div className="controls-bar">
                        <div className="search-container">
                            <Search size={20} color="#888" />
                            <input
                                type="text"
                                placeholder="Pesquisar cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        
                        <div className="stats-container">
                            <span>{clientes.length} clientes foram <br/> cadastrados</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}