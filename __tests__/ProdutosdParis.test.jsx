import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
//import ClienteForm from '../src/app/components/ClienteForm'
import ProdutosdParis from '../src/app/telaPrincipal/page'
describe('ProdutosdParis', () => {
  it('renderiza sem erros', () => {
    render(<ProdutosdParis/>)
  })
});
