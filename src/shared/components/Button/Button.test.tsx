import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button label="Click" onClick={handleClick} />)
    await user.click(screen.getByText('Click'))
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('renders with primary variant by default', () => {
    render(<Button label="Button" />)
    const button = screen.getByText('Button')
    expect(button.className).toContain('primary')
  })

  it('renders with secondary variant', () => {
    render(<Button label="Button" variant="secondary" />)
    const button = screen.getByText('Button')
    expect(button.className).toContain('secondary')
  })

  it('renders with outline variant', () => {
    render(<Button label="Button" variant="outline" />)
    const button = screen.getByText('Button')
    expect(button.className).toContain('outline')
  })

  it('renders as full width', () => {
    render(<Button label="Button" fullWidth />)
    const button = screen.getByText('Button')
    expect(button.className).toContain('fullWidth')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Button" disabled />)
    const button = screen.getByText('Button')
    expect(button).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button label="Click" onClick={handleClick} disabled />)
    await user.click(screen.getByText('Click'))
    
    expect(handleClick).not.toHaveBeenCalled()
  })
})
