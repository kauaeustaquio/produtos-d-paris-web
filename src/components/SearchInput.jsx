// src/components/SearchInput.jsx
'use client'; // <-- ESSENCIAL!

import { useSearchParams } from 'next/navigation';

export function SearchInput() {
    // Leitura síncrona e segura, feita no lado do cliente
    const searchParams = useSearchParams();
    const buscaValor = searchParams.get('busca') || '';

    return (
        <form method="get" className="search-form">
            <input
                type="text"
                className="caixa-de-pesquisa"
                name="busca"
                placeholder="Pesquisar..."
                defaultValue={buscaValor} // Valor lido de forma segura
            />
            <button type="submit" style={{ display: 'none' }}></button>
        </form>
    );
}