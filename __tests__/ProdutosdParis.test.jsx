import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Mock do banco
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn().mockResolvedValue([]),
  },
}));

// Mock EditButton
jest.mock('@/components/EditButton', () => () => <div data-testid="edit-button">Edit</div>);

// Mock SearchInput
jest.mock('@/components/SearchInput', () => ({
  SearchInput: () => <input data-testid="search-input" />,
}));

// Mock de fetch global
global.fetch = jest.fn();

// Import do componente
import ProdutosdParis from '@/app/telaPrincipal/page';

// --------------------- TESTES ---------------------

describe("ProdutosdParis Page", () => {

  beforeEach(() => {
    fetch.mockReset();
  });

  // ------------------- TESTE 1 -------------------
  it("renderiza a página sem quebrar", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  // ------------------- TESTE 2 -------------------
  it("renderiza mensagem de nenhum produto", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(
      screen.getByText("Nenhum produto cadastrado no momento.")
    ).toBeInTheDocument();
  });

  // ------------------- TESTE 3 -------------------
  it("renderiza produtos por categoria", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { id: 1, nome: "Shampoo", valor: 30, categoria: "Cabelos", imagem: "/img/x.png" }
      ]),
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(screen.getByText("Cabelos")).toBeInTheDocument();
    expect(screen.getByText("Shampoo")).toBeInTheDocument();
  });

  // ------------------- TESTE 4 -------------------
  it("renderiza preço sem promoção", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { id: 2, nome: "Perfume", valor: 100, categoria: "Perfumaria" }
      ]),
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
  });

  // ------------------- TESTE 5 -------------------
  it("renderiza preço com promoção e desconto", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          id: 3,
          nome: "Creme",
          valor: 50,
          categoria: "Corpo",
          emPromocao: true,
          desconto: 20
        }
      ]),
    });

    render(await ProdutosdParis({ searchParams: {} }));

    // Preço riscado
    expect(screen.getByText("R$ 50,00")).toBeInTheDocument();

    // Preço correto com desconto → 40.00
    expect(screen.getByText("R$ 40,00")).toBeInTheDocument();
  });

  // ------------------- TESTE 6 -------------------
  it("renderiza EditButton", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { id: 10, nome: "Produto X", valor: 10, categoria: "Teste" }
      ]),
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  });

  // ------------------- TESTE 7 -------------------
  it("renderiza ícones de info e usuário", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(screen.getByAltText("Informações")).toBeInTheDocument();
    expect(screen.getByAltText("Usuário")).toBeInTheDocument();
  });

  // ------------------- TESTE 8 -------------------
  it("renderiza banner", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(screen.getByAltText("banner")).toBeInTheDocument();
  });

  // ------------------- TESTE 9 -------------------
  it("mostra mensagem de busca sem resultados", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(await ProdutosdParis({ searchParams: { busca: "abc" } }));

    expect(
      screen.getByText('Nenhum produto encontrado para "abc".')
    ).toBeInTheDocument();
  });

  // ------------------- TESTE 10 -------------------
  it("API com erro retorna lista vazia", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(await ProdutosdParis({ searchParams: {} }));

    expect(
      screen.getByText("Nenhum produto cadastrado no momento.")
    ).toBeInTheDocument();
  });

});
