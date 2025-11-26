import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import EditButton from '/src/components/EditButton';

jest.mock('/src/components/EditProductModal', () => ({
  __esModule: true,
  default: ({ onClose, onSave, product }) => (
    <div data-testid="edit-modal">
      <p>Modal aberto para ID {product.id}</p>

      <button onClick={onClose} data-testid="close-btn">
        Fechar
      </button>

      <button
        onClick={() => onSave({ nome: "Produto Atualizado" })}
        data-testid="save-btn"
      >
        Salvar
      </button>
    </div>
  ),
}));

describe('EditButton', () => {

  const produtoFake = {
    id: 123,
    nome: "Produto Teste"
  };

  it('renderiza o botão', () => {
    render(<EditButton produto={produtoFake} />);

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });

  it('abre o modal ao clicar no botão', () => {
    render(<EditButton produto={produtoFake} />);

    const btn = screen.getByRole('button');
    fireEvent.click(btn);

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal aberto para ID 123')).toBeInTheDocument();
  });

  it('fecha o modal ao clicar no botão Fechar', () => {
    render(<EditButton produto={produtoFake} />);

    fireEvent.click(screen.getByRole('button'));

    const fecharBtn = screen.getByTestId('close-btn');
    fireEvent.click(fecharBtn);

    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });

  it('executa onSave e fecha o modal', () => {
    render(<EditButton produto={produtoFake} />);

    fireEvent.click(screen.getByRole('button'));

    const saveBtn = screen.getByTestId('save-btn');
    fireEvent.click(saveBtn);

    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });

});
