import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useDebounce from './useDebounce'

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('breed1', 300))
    expect(result.current).toBe('breed1')
  })

  it('does not update value before delay has passed', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'breed1', delay: 300 } }
    )

    rerender({ value: 'breed2', delay: 300 })

    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current).toBe('breed1')

    vi.useRealTimers()
  })

  it('updates value after delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'breed1', delay: 300 } }
    )

    rerender({ value: 'breed2', delay: 300 })

    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe('breed2')

    vi.useRealTimers()
  })

})
