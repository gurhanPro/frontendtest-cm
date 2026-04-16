import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BreedList from './BreedList'

const mockBreeds = [
  { name: 'breed1', subBreeds: [] },
  { name: 'breed2', subBreeds: [] },
  { name: 'breed3', subBreeds: ['boston', 'english', 'french'] },
]

describe('BreedList', () => {
  it('renders all breeds passed to it', () => {
    render(
      <BreedList breeds={mockBreeds} selectedBreed={null} setSelectedBreed={() => {}} />
    )

    expect(screen.getByText('breed1')).toBeInTheDocument()
    expect(screen.getByText('breed2')).toBeInTheDocument()
    expect(screen.getByText('breed3')).toBeInTheDocument()
  })

  it('shows empty message when breeds list is empty', () => {
    render(
      <BreedList breeds={[]} selectedBreed={null} setSelectedBreed={() => {}} />
    )

    expect(screen.getByText('No breeds match your filter')).toBeInTheDocument()
  })

  it('highlights the selected breed', () => {
    const selected = mockBreeds[1]
    render(
      <BreedList breeds={mockBreeds} selectedBreed={selected} setSelectedBreed={() => {}} />
    )

    const breed2Item = screen.getByText('breed2')
    expect(breed2Item.className).toContain('selected')

    const breed1Item = screen.getByText('breed1')
    expect(breed1Item.className).not.toContain('selected')
  })
})
