import { render, screen, fireEvent } from '@testing-library/react'
import { InputField } from '../InputField'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom' // adds matchers like toBeInTheDocument

describe('InputField', () => {
  it('renders label and calls onChange', () => {
    const handle = vi.fn()
    render(<InputField label="Email" placeholder="you@example.com" onChange={handle} />)
    
    const input = screen.getByPlaceholderText('you@example.com') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'a@b.com' } })
    
    expect(handle).toHaveBeenCalled()
  })

  it('shows error when invalid', () => {
    render(<InputField label="Name" invalid errorMessage="Required" />)
    
    expect(screen.getByText('Required')).toBeInTheDocument()
    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
