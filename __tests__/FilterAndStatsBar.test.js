import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterAndStatsBar from '@/app/telaEstoque/pageComponents/FilterAndStatsBar'

describe("FilterAndStatsBar — Campo de Busca", () => {
  it("altera o campo de busca corretamente", () => {
    const setSearchTerm = jest.fn()
    render(
      <FilterAndStatsBar
        searchTerm=""
        setSearchTerm={setSearchTerm}
        produtosCount={0}
        isFilterPopupOpen={false}
        setIsFilterPopupOpen={() => {}}
        activeFilter=""
        handleFilterClick={() => {}}
        categoriasFiltro={[]}
        onAddProduct={() => {}}
        onAddCategory={() => {}}
      />
    )
    const input = screen.getByPlaceholderText("Pesquisar produto...")
    fireEvent.change(input, { target: { value: "Veja" } })
    expect(setSearchTerm).toHaveBeenCalledWith("Veja")
  })
})


