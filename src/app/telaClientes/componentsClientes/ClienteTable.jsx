// components/ClienteTable.jsx
import React from "react";
// Certifique-se de importar 'User' ou 'CircleUser' do lucide-react
import { Phone, Mail, UserCheck, UserX, CircleUser } from "lucide-react"; 
import StatusToggleButton from "./StatusToggleButton";

export default function ClienteTable({ clientes, loading, error, searchTerm, statusFilter, onConfirmRequest }) {
    if (error) {
        return (
            <p className="error-message">
                {error}
            </p>
        );
    }

    if (loading) {
        return (
            <div className="loading-message">
                Carregando clientes...
            </div>
        );
    }
    
    return (
        <div className="client-table-container">
            <table className="client-list">
                <thead>
                    <tr>
                        {/* Nome da coluna 'Nome' sem o ícone do usuário */}
                        <th>Nome <span className="sort-icon">A ↓</span></th> 
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Ações</th> 
                    </tr>
                </thead>
                <tbody>
                    {clientes.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-clients-message">
                                {searchTerm || statusFilter !== 'todos' 
                                    ? `Nenhum cliente encontrado com os filtros aplicados.` 
                                    : "Nenhum cliente cadastrado."
                                }
                            </td>
                        </tr>
                    ) : (
                        clientes.map((cliente) => (
                            <tr key={cliente.id} className={!cliente.status_ativo ? 'client-inactive' : ''}> 
                                <td className="client-name">
                                    {/* ÍCONE DE PERFIL AO LADO DO NOME DO CLIENTE */}
                                    {/* Usando CircleUser conforme solicitado */}
                                    <CircleUser size={60} className="icon-profile" strokeWidth={0.5} /> 
                                    {cliente.nome}
                                </td>
                                <td><Phone size={14} className="icon-inline" /> {cliente.telefone || 'N/A'}</td>
                                <td><Mail size={14} className="icon-inline" /> {cliente.email || 'N/A'}</td>
                                <td className="client-status">
                                    {cliente.status_ativo ? (
                                        <span className="status-active">
                                            <UserCheck size={16} className="icon-inline" /> Ativo
                                        </span>
                                    ) : (
                                        <span className="status-inactive">
                                            <UserX size={16} className="icon-inline" /> Inativo
                                        </span>
                                    )}
                                </td>
                                <td className="client-actions">
                                    <StatusToggleButton 
                                        cliente={cliente} 
                                        onConfirmRequest={onConfirmRequest}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}