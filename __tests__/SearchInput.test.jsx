import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
//import ClienteForm from '../src/app/components/ClienteForm'
import SearchInput from '../src/components/SearchInput/'
describe('SearchInput', () => {
  it('renderiza sem erros', () => {
    render(<SearchInput/>)
  })
});
