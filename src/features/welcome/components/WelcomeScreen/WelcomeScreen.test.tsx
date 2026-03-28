import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ReactElement } from 'react'
import { WelcomeScreen } from './WelcomeScreen'

describe('WelcomeScreen', () => {
  const renderWithRouter = (component: ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('renders welcome heading', () => {
    renderWithRouter(<WelcomeScreen />)
    expect(screen.getByText(/Welcome to Your React Project Foundation/i)).toBeInTheDocument()
  })

  it('renders app title in header', () => {
    renderWithRouter(<WelcomeScreen />)
    expect(screen.getByText('LeetCode Competitor')).toBeInTheDocument()
  })

  it('renders version number', () => {
    renderWithRouter(<WelcomeScreen />)
    expect(screen.getByText(/v0.1.0/i)).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    renderWithRouter(<WelcomeScreen />)
    expect(screen.getByText('🚀 Quick Start')).toBeInTheDocument()
    expect(screen.getByText('📁 Organized Structure')).toBeInTheDocument()
    expect(screen.getByText('🧪 Testing Ready')).toBeInTheDocument()
    expect(screen.getByText('🎨 Code Quality')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    renderWithRouter(<WelcomeScreen />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('View Documentation')).toBeInTheDocument()
  })

  it('displays technology highlights', () => {
    renderWithRouter(<WelcomeScreen />)
    expect(screen.getByText(/TypeScript for type safety/i)).toBeInTheDocument()
    expect(screen.getByText(/Vite for lightning-fast HMR/i)).toBeInTheDocument()
    expect(screen.getByText(/Feature-based architecture/i)).toBeInTheDocument()
  })
})
