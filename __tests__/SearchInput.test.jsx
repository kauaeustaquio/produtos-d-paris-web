import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import SearchInput from './src/components/SearchInput/'

describe('SearchInput', () => {
  it('renderiza sem erros', () => {
    render(<SearchInput />)
  })
})
