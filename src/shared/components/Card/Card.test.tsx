import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders children content', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders with title', () => {
    render(
      <Card title="Test Title">
        <p>Content</p>
      </Card>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders with footer', () => {
    render(
      <Card footer={<span>Footer content</span>}>
        <p>Content</p>
      </Card>
    )
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('applies hoverable class when hoverable prop is true', () => {
    const { container } = render(
      <Card hoverable>
        <p>Content</p>
      </Card>
    )
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('hoverable')
  })

  it('does not apply hoverable class by default', () => {
    const { container } = render(
      <Card>
        <p>Content</p>
      </Card>
    )
    const card = container.firstChild as HTMLElement
    expect(card.className).not.toContain('hoverable')
  })

  it('renders title, content, and footer together', () => {
    render(
      <Card title="Title" footer={<span>Footer</span>}>
        <p>Content</p>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
