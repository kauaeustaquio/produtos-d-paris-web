// app/telaClientes/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import ClienteTable from "./componentsClientes/ClienteTable"; 
import ConfirmationModal from "./componentsClientes/ConfirmationModal"; // Importa o modal
import "./style.css"; 

// Valores de filtro: 'todos' | 'ativo' | 'inativo'
const INITIAL_STATUS_FILTER = 'todos'; 

// =========================================================================
// FUNÇÃO DE API PARA BUSCAR CLIENTES
// (Mantida, sem alterações)
// =========================================================================
async function getClientes(buscaTermo = '', statusFiltro = INITIAL_STATUS_FILTER) {
    const path = '/api/clientes';
    const params = new URLSearchParams();

    if (buscaTermo) {
        params.set('search', buscaTermo);
    }
    
    if (statusFiltro !== INITIAL_STATUS_FILTER) {
        params.set('status', statusFiltro); 
    }
    
    const url = `${path}?${params.toString()}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            const errorText = await res.text();
            return { error: `Falha na busca (Status: ${res.status}). Detalhes: ${errorText.substring(0, 100)}`, data: [] }; 
        }
        const data = await res.json();
        return { data };
    } catch (error) {
        return { error: 'Erro de rede ao buscar clientes. Tente novamente.', data: [] };
    }
}

// =========================================================================
// FUNÇÃO DE API PARA ATUALIZAR STATUS (Movida para o componente principal)
// =========================================================================
async function toggleClienteStatus(clienteId, novoStatus) {
    const url = `/api/clientes/${clienteId}/status`; 

    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: novoStatus }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Falha ao alterar status. Detalhes: ${errorText}`);
    }

    return res.json();
}


// =========================================================================
// COMPONENTE PRINCIPAL (TELA)
// =========================================================================
export default function TelaClientes() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(INITIAL_STATUS_FILTER);
    
    const [clientes, setClientes] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NOVO ESTADO: Armazena o cliente e a ação pendente para o modal
    const [pendingConfirmation, setPendingConfirmation] = useState(null); // { cliente: {..}, action: 'ativar' | 'inativar' }


    const fetchClientes = useCallback(async (busca, status) => {
        setLoading(true);
        setError(null);
        
        const result = await getClientes(busca, status);
        
        if (result.error) {
            setError(result.error);
            setClientes([]);
        } else {
            setClientes(result.data || []); 
        }
        setLoading(false);
    }, []);

    // Função para ser passada para os subcomponentes para forçar a atualização
    const handleClienteStatusChange = () => {
        // Após a mudança de status, remove a confirmação e refaz a busca
        setPendingConfirmation(null);
        fetchClientes(searchTerm, statusFilter);
    };
    
    // 1. Função chamada pelo botão na tabela
    const handleConfirmRequest = (cliente, action) => {
        // Define o estado para mostrar o modal
        setPendingConfirmation({ cliente, action });
    };

    // 2. Função chamada ao clicar em 'Sim' no modal
    const handleModalConfirm = async (cliente, action) => {
        const novoStatus = action === 'ativar';
        
        try {
            // Lógica de atualização da API
            await toggleClienteStatus(cliente.id, novoStatus);
            handleClienteStatusChange(); // Refaz a busca
        } catch (err) {
            setError(`Erro ao finalizar a ação: ${err.message}`);
            setPendingConfirmation(null); // Fecha o modal
        }
    };

    // 3. Função chamada ao clicar em 'Não' no modal
    const handleModalCancel = () => {
        setPendingConfirmation(null); // Fecha o modal sem ação
    };


    useEffect(() => {
        const handler = setTimeout(() => {
            fetchClientes(searchTerm, statusFilter);
        }, 300); 

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, statusFilter, fetchClientes]);


    return (
        <div className="tela-clientes-wrapper">
            {/* -------------------- MODAL DE CONFIRMAÇÃO -------------------- */}
            {pendingConfirmation && (
                <ConfirmationModal
                    cliente={pendingConfirmation.cliente}
                    action={pendingConfirmation.action}
                    onConfirm={handleModalConfirm}
                    onCancel={handleModalCancel}
                />
            )}
            {/* -------------------------------------------------------------- */}
            
            <div className="top-bar">
                <a href="/telaPrincipal" className="home-botao">
                    <img src="/img/home-botao.png" alt="Ícone de Home" style={{ width: '40px', height: '40px' }} />
                </a>
                <div className="right-icons-group"> 
                    <a href="telaInfo" className="info-icon">
                        <img src="/img/info-botao.png" alt="Ícone de Informações" style={{ width: '40px', height: '40px' }} />
                    </a>
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

                    {/* Barra de Controles (Filtros) */}
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

                        <div className="status-filter-container">
                            <label htmlFor="status-select">Status:</label>
                            <select
                                id="status-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)} 
                                disabled={loading}
                                className="status-select"
                            >
                                <option value="todos">Todos</option>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                            </select>
                        </div>
                        
                        <div className="stats-container">
                            <span>**{clientes.length} clientes** {loading ? 'sendo contados' : 'encontrados'}</span>
                        </div>
                    </div>

                    {/* Componente Modularizado da Tabela */}
                    <ClienteTable
                        clientes={clientes}
                        loading={loading}
                        error={error}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                        onConfirmRequest={handleConfirmRequest} // Passa a função para abrir o modal
                    />
                </div>
            </div>
        </div>
    );
}