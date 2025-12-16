"use client";

import React, { useState } from 'react';
// Importações dos ícones do Lucide React
import { 
    Settings, 
    User, 
    ClipboardList, 
    Search, 
    Filter, 
    QrCode, 
    DollarSign 
} from 'lucide-react';

// Dados Mockados para o estado inicial (Mantidos)
const initialOrders = [
  {
    id: '001',
    cliente: 'Gabriela da Costa Rodrigues',
    itens: [
      '2x Veja Limpeza Multiuso 500ml',
      '1x Desinfetante Lysoform 1L',
      '1x Cif Creme 500g',
    ],
    // Mapeamento para os componentes Lucide
    pagamento: { tipo: 'Pix', icon: QrCode },
    total: '31,00',
    status: 'Concluido',
  },
];

// Estilos CSS (Mantidos, mas garantindo que o CSS se aplique aos novos elementos)
const styles = `
    /* ... (Mantenha todo o CSS anterior aqui) ... */
    :root {
        --bg-color: #f7f7f7;
        --card-bg: #ffffff;
        --text-dark: #333333;
        --text-light: #666666;
        --border-color: #e0e0e0;
        --status-concluido: #4CAF50;
        --status-pendente: #FFC107;
        --status-cancelado: #F44336;
        --highlight-color: #00897B;
        --icon-color: #3d3d3d;
    }
    .pedidos-body {
        font-family: 'Roboto', sans-serif;
        background-color: var(--bg-color);
        margin: 0;
        padding: 0;
        color: var(--text-dark);
    }
    .container {
            max-width: 1195px; /* NOVO TAMANHO SOLICITADO */
            margin: 0 auto;
            padding: 20px;
        }
    .header {
        background-color: #000;
        color: #fff;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px 20px;
        height: 40px;
    }
    .header-icons {
        display: flex;
        gap: 15px;
    }
    .header-icon {
        font-size: 24px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.2s;
    }
    .header-icon:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    .main-title {
        text-align: center;
        padding: 20px 0;
    }
    .main-title .icon {
        font-size: 32px;
        color: var(--icon-color);
        /* Estilo para ajustar o tamanho do Lucide Icon */
        height: 32px; 
        width: 32px;
    }
    .main-title h1 {
        font-size: 24px;
        font-weight: 500;
        margin: 5px 0 0 0;
        color: var(--text-dark);
    }
    .search-filter-bar {
        background-color: var(--card-bg);
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search-input-area {
        display: flex;
        flex-grow: 1;
        align-items: center;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 10px;
        margin-right: 15px;
        background-color: var(--bg-color);
    }
    .search-input-area .icon {
        color: var(--text-light);
        margin-right: 10px;
        /* Estilo para ajustar o tamanho do Lucide Icon */
        height: 18px; 
        width: 18px;
    }
    .search-input-area input {
        border: none;
        outline: none;
        flex-grow: 1;
        background: transparent;
        font-size: 14px;
        color: var(--text-dark);
    }
    .search-info {
        font-size: 14px;
        color: var(--text-light);
        margin-left: 15px;
        white-space: nowrap;
    }
    .filter-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        font-weight: 500;
        transition: color 0.2s;
        padding: 0;
    }
    .filter-btn:hover {
        color: var(--text-dark);
    }
    .filter-btn .icon {
        font-size: 20px;
        margin-bottom: 2px;
        /* Estilo para ajustar o tamanho do Lucide Icon */
        height: 20px; 
        width: 20px;
    }
    .pedidos-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .pedidos-header h2 {
        font-size: 18px;
        font-weight: 500;
        margin: 0;
        color: var(--text-dark);
    }
    .pedidos-header .status-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-dark);
    }
    .order-card {
        background-color: var(--card-bg);
        border-radius: 10px;
        padding: 15px 20px;
        margin-bottom: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
    }
    .order-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
    }
    .order-details {
        flex-grow: 1;
    }
    .order-number {
        font-size: 16px;
        font-weight: 700;
        color: var(--highlight-color);
        margin-bottom: 5px;
    }
    .order-number span {
        color: var(--text-dark);
        font-weight: 400;
    }
    .client-name {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
    }
    .order-items {
        list-style: none;
        padding: 0;
        margin: 5px 0 10px 0;
        font-size: 14px;
        color: var(--text-light);
        line-height: 1.5;
    }
    .order-items li {
        margin-left: 10px;
    }
    .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px dashed var(--border-color);
        padding-top: 10px;
        margin-top: 10px;
    }
    .payment-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--text-light);
        font-weight: 500;
    }
    .payment-icon {
        /* Tamanho padrão do ícone Lucide */
        height: 20px;
        width: 20px;
        margin-right: 5px;
        color: var(--highlight-color);
    }
    .payment-icon.cash svg {
        color: var(--status-concluido);
    }
    .order-total {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-dark);
    }
    .status-tag {
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
        text-transform: uppercase;
        text-align: center;
        min-width: 80px;
        white-space: nowrap;
    }
    .status-tag.Concluido {
        background-color: var(--status-concluido);
    }
    .status-tag.Pendente {
        background-color: var(--status-pendente);
        color: var(--text-dark);
    }
    .status-tag.Cancelado {
        background-color: var(--status-cancelado);
    }

    /* Toggle Switch (Mantido) */
    .status-toggle-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 45px;
        height: 25px;
    }
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--text-light);
        transition: .4s;
        border-radius: 34px;
    }
    .toggle-switch input:checked + .slider {
        background-color: var(--status-concluido);
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 19px;
        width: 19px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    .toggle-switch input:checked + .slider:before {
        transform: translateX(20px);
    }

    /* Media Queries (Mantidas) */
    @media (max-width: 600px) {
        .container {
            padding: 10px;
        }
        .search-filter-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 10px;
        }
        .search-input-area {
            margin-right: 0;
            margin-bottom: 10px;
            padding: 10px;
        }
        .search-info {
            display: none;
        }
    }
`;

// Injeta os estilos no DOM
const StyleInjector = () => (
    <style dangerouslySetInnerHTML={{ __html: styles }} />
);

// Componente Cartão de Pedido
const OrderCard = ({ order, onToggleStatus, onClick }) => {
  const IconComponent = order.pagamento.icon;
  const isConcluido = order.status === 'Concluido';

  return (
    <div className="order-card" onClick={() => onClick(order.id)}>
      <div className="order-header">
        <div className="order-details">
          <p className="order-number">
            N° <strong>#{order.id}</strong>
          </p>
          <p className="client-name">Cliente: <strong>{order.cliente}</strong></p>
          <p className="client-name">Itens:</p>
          <ul className="order-items">
            {order.itens.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        
        {/* Renderização condicional do switch para o Pedido #002 */}
        {order.id === '002' ? (
          <div className="status-toggle-area" onClick={(e) => e.stopPropagation()}>
            <div className={`status-tag ${order.status}`}>{order.status}</div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isConcluido}
                onChange={() => onToggleStatus(order.id, !isConcluido)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ) : (
          <div className={`status-tag ${order.status}`}>{order.status}</div>
        )}
      </div>

      <div className="order-footer">
        <div className="payment-info">
          Pagamento:{' '}
          <IconComponent 
            className={`payment-icon ${order.pagamento.isCash ? 'cash' : ''}`} 
          />
          <strong>{order.pagamento.tipo}</strong>
        </div>
        <div className="order-total">
          Total: <strong>R$ {order.total}</strong>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const PedidosGeral = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  const handleCardClick = (id) => {
    // Aqui você usaria o useRouter() do Next.js para navegar
    alert(`Você clicou no Pedido #${id}! (Simulação de navegação/rota)`);
  };
  
  const handleFilterClick = () => {
    alert('O botão "Filtrar" foi clicado! (Simulação de modal de filtros)');
  };

  const handleToggleStatus = (id, isChecked) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id 
          ? { ...order, status: isChecked ? 'Concluido' : 'Pendente' } 
          : order
      )
    );
    alert(`Status do Pedido #${id} alterado para ${isChecked ? 'CONCLUÍDO' : 'PENDENTE'}!`);
  };

  return (
    <div className="pedidos-body">
      <StyleInjector />
      
      {/* Header */}
      <div className="header">
        <div className="header-icons">
          <span className="header-icon" title="Configurações" onClick={() => alert('Ação: Configurações')}>
            <Settings size={24} color="white" />
          </span>
          <span className="header-icon" title="Perfil" onClick={() => alert('Ação: Perfil do Usuário')}>
            <User size={24} color="white" />
          </span>
        </div>
      </div>

      <div className="container">
        {/* Título Principal */}
        <div className="main-title">
          <div className="icon">
            <ClipboardList />
          </div>
          <h1>Pedidos</h1>
        </div>

        {/* Barra de Pesquisa e Filtro */}
        <div className="search-filter-bar">
          <div className="search-input-area">
            <span className="icon">
              <Search />
            </span>
            <input
              type="text"
              placeholder="Pesquisar pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="search-info">
            {filteredOrders.length} Pedido{filteredOrders.length !== 1 ? 's' : ''} foram encontrados
          </span>
          <button className="filter-btn" title="Filtrar Pedidos" onClick={handleFilterClick}>
            <span className="icon">
              <Filter />
            </span>
            Filtrar
          </button>
        </div>

        {/* Seção de Pedidos */}
        <div className="pedidos-header">
          <h2>Pedidos</h2>
          <h2 className="status-title">Status</h2>
        </div>

        <div id="pedidosList">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={handleCardClick}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PedidosGeral;