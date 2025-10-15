import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
//import ClienteForm from '../src/app/components/ClienteForm'
import EditButton from '../src/components/EditButton'
describe('EditButton', () => {
  it('renderiza sem erros', () => {
    render(<EditButton/>)
  })
});
