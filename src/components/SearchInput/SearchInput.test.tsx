import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchInput from './SearchInput'

describe('SearchInput', () => {
  it('renders with the provided value', () => {
    render(<SearchInput value="poodle" onChange={() => {}} />)

    const input = screen.getByPlaceholderText('type a bread name') as HTMLInputElement
    expect(input.value).toBe('poodle')
  })

  it('calls onChange with the typed text, not the raw event', () => {
    const handleChange = vi.fn()
    render(<SearchInput value="" onChange={handleChange} />)

    const input = screen.getByPlaceholderText('type a bread name')
    fireEvent.change(input, { target: { value: 'breed1' } })

    expect(handleChange).toHaveBeenCalledWith('breed1')
  })

})
