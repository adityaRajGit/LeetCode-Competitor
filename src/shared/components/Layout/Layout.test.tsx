import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renders children content', () => {
    render(
      <Layout>
        <div>Main content</div>
      </Layout>
    )
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })

  it('renders header when provided', () => {
    render(
      <Layout header={<h1>Header Title</h1>}>
        <div>Content</div>
      </Layout>
    )
    expect(screen.getByText('Header Title')).toBeInTheDocument()
  })

  it('renders without header when not provided', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    )
    const header = container.querySelector('header')
    expect(header).not.toBeInTheDocument()
  })

  it('renders header and main content together', () => {
    render(
      <Layout header={<span>Header</span>}>
        <span>Main</span>
      </Layout>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Main')).toBeInTheDocument()
  })
})
