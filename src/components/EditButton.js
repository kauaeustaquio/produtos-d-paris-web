'use client';

import { Pencil } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function EditButton({ productId }) {
    const router = useRouter();

    const handleEditClick = (e) => {
        e.preventDefault(); // Impede o comportamento padrão do link/botão se houver
        
        // Redireciona para a tela de estoque, passando o ID do produto para edição.
        // A telaEstoque deve ser ajustada para ler este parâmetro.
        router.push(`/telaEstoque?editId=${productId}`); 
    };

    return (
        <button 
            onClick={handleEditClick} 
            className="edit-icon-link" // Mantendo a classe para estilização
            title={`Editar Produto ID ${productId}`}
        >
            <Pencil className="pencil-icon" />
        </button>
    );
}