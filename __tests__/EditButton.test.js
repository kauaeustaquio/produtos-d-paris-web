import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import EditButton from '/src/components/EditButton';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush, 
  }),
}));

describe('EditButton', () => {

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renderiza sem erros', () => {
    render(<EditButton productId="123" />);

    //Faz uma busca de um elemento do tipo button (ele deve existir)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('chama router.push ao clicar', () => {
    render(<EditButton productId="123" />);

    const button = screen.getByRole('button');
    
    //Simula o clique no botão
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/telaEstoque?editId=123');
  });

});
