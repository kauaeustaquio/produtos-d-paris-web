import React, { useState, useMemo } from "react";
import { Phone, Mail, UserCheck, UserX, CircleUser } from "lucide-react";
import StatusToggleButton from "./StatusToggleButton";

export default function ClienteTable({
  clientes,
  loading,
  error,
  searchTerm,
  statusFilter,
  onConfirmRequest
}) {
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc'

  const clientesOrdenados = useMemo(() => {
    if (!sortOrder) return clientes;

    return [...clientes].sort((a, b) =>
      sortOrder === "asc"
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome)
    );
  }, [clientes, sortOrder]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (loading) {
    return <div className="loading-message">Carregando clientes...</div>;
  }

  return (
    <div className="client-table-container">
      <table className="client-list">
        <thead>
  <tr>
    <th className="th-left">
      <div className="sort-header">
        <span
          className="sort-icon"
          onClick={() => setSortOrder("asc")}
          title="Ordenar A → Z"
        >
          A ↓
        </span>
        <span
          className="sort-icon"
          onClick={() => setSortOrder("desc")}
          title="Ordenar Z → A"
        >
          Z ↑
        </span>
      </div>
    </th>

    <th className="th-center">Telefone</th>
    <th className="th-left">Email</th>
    <th className="th-center">Status</th>
    <th className="th-right">Ações</th>
  </tr>
</thead>


        <tbody>
          {clientesOrdenados.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-clients-message">
                Nenhum cliente encontrado.
              </td>
            </tr>
          ) : (
            clientesOrdenados.map((cliente) => (
              <tr
                key={cliente.id}
                className={!cliente.status_ativo ? "client-inactive" : ""}
              >
                {/* NOME */}
                <td className="td-left client-name">
                  <CircleUser size={60} strokeWidth={0.5} className="icon-profile" />
                  {cliente.nome}
                </td>

                {/* TELEFONE */}
                <td className="td-center">
                  <Phone size={14} className="icon-inline" />
                  {cliente.telefone || "N/A"}
                </td>

                {/* EMAIL */}
                <td className="td-left">
                  <Mail size={14} className="icon-inline" />
                  {cliente.email || "N/A"}
                </td>

                {/* STATUS */}
                <td className="td-center">
                  {cliente.status_ativo ? (
                    <span className="status-active">
                      <UserCheck size={16} className="icon-inline" />
                      Ativo
                    </span>
                  ) : (
                    <span className="status-inactive">
                      <UserX size={16} className="icon-inline" />
                      Inativo
                    </span>
                  )}
                </td>

                {/* AÇÕES */}
                <td className="td-right client-actions">
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
