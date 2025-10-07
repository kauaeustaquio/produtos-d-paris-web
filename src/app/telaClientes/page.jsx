// app/telaClientes/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Phone, Mail } from "lucide-react";
import "./style.css"; // Certifique-se de que este caminho está correto

// Função para buscar os clientes da API (assume que a rota /api/clientes está funcionando)
async function getClientes(buscaTermo = '') {
    // CORREÇÃO: Usar apenas o caminho relativo para chamadas do lado do cliente.
    const path = '/api/clientes';

    // Constrói a URL usando o caminho relativo. O navegador infere o domínio (localhost ou produção).
    const url = buscaTermo 
        ? `${path}?search=${encodeURIComponent(buscaTermo)}`
        : path;

    try {
        const res = await fetch(url, {
            cache: 'no-store' 
        });

        if (!res.ok) {
            console.error(`Status HTTP: ${res.status}`);
            // Retorna um erro amigável para o usuário
            return { error: `Falha na busca (Status: ${res.status}). Verifique a rota da API.`, data: [] }; 
        }

        const data = await res.json();
        // A API deve retornar um objeto com uma propriedade 'data' que é o array de clientes,
        // mas aqui estamos assumindo que 'data' *é* o array, se não houver um 'error'.
        // Se a API retornar { clientes: [...] }, ajuste para 'return { data: data.clientes }'
        return { data };

    } catch (error) {
        // Este bloco é atingido em caso de erro de rede real (DNS, conexão recusada)
        console.error("Erro ao carregar clientes:", error.message);
        return { error: 'Erro de rede ao buscar clientes.', data: [] };
    }
}


export default function TelaClientes() {
    // Estados para a busca, a lista e o estado de carregamento
    const [searchTerm, setSearchTerm] = useState("");
    const [clientes, setClientes] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar os clientes, memorizada para evitar recriação desnecessária
    const fetchClientes = useCallback(async (busca) => {
        setLoading(true);
        setError(null);
        
        const result = await getClientes(busca);
        
        if (result.error) {
            setError(result.error);
            setClientes([]);
        } else {
            // Garante que o estado seja atualizado com o array de clientes
            setClientes(result.data || []); 
        }
        setLoading(false);
    }, []);

    // Efeito para acionar a busca sempre que o termo de busca mudar (com Debounce)
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchClientes(searchTerm);
        }, 300);

        // Função de limpeza para cancelar o timer se o termo mudar novamente
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, fetchClientes]);


    return (
        // OTIMIZAÇÃO: Usando uma div raiz para melhor estrutura de layout/estilo
        <div className="tela-clientes-wrapper">
            <div className="top-bar">
                {/* 1. Elemento da Esquerda: Home */}
                <a href="/telaPrincipal" className="home-botao">
                    <img src="/img/home-botao.png" alt="Ícone de Home" style={{ width: '40px', height: '40px' }} />
                </a>
                
                {/* 2. Elemento da Direita: Grupo de Info e Usuário */}
                <div className="right-icons-group"> 
                    {/* Ícone de Informações */}
                    <a href="telaInfo" className="info-icon">
                        <img src="/img/info-botao.png" alt="Ícone de Informações" style={{ width: '40px', height: '40px' }} />
                    </a>
                    
                    {/* Ícone do Usuário */}
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

                    {/* Barra de pesquisa e contagem de clientes */}
                    <div className="controls-bar">
                        <div className="search-container">
                            <Search size={20} color="#888" />
                            <input
                                type="text"
                                placeholder="Pesquisar por nome, telefone ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="stats-container">
                            <span>**{clientes.length} clientes** {loading ? 'sendo contados' : 'encontrados'}</span>
                        </div>
                    </div>

                    {/* Área de Exibição da Tabela/Mensagens */}
                    <div className="client-table-container">
                        {/* Mensagem de Erro (se houver) */}
                        {error && (
                            <p className="error-message" style={{ color: 'red', textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>
                                Erro ao carregar dados: {error}
                            </p>
                        )}
                        
                        {/* Mensagem de Loading ou Tabela */}
                        {loading && !error ? (
                            <div className="loading-message">Carregando clientes...</div>
                        ) : (
                            <table className="client-list">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Telefone</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.length === 0 ? (
                                        <tr>
                                            {/* Colspan ajustado para 3 colunas */}
                                            <td colSpan="3" className="no-clients-message">
                                                {searchTerm 
                                                    ? `Nenhum cliente encontrado para "${searchTerm}".` 
                                                    : "Nenhum cliente cadastrado."
                                                }
                                            </td>
                                        </tr>
                                    ) : (
                                        clientes.map((cliente) => (
                                            <tr key={cliente.id}> {/* Usa o ID retornado pela API como chave */}
                                                <td className="client-name">{cliente.nome}</td>
                                                <td><Phone size={14} className="icon-inline" /> {cliente.telefone || 'N/A'}</td>
                                                <td><Mail size={14} className="icon-inline" /> {cliente.email || 'N/A'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}