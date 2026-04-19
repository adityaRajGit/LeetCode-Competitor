import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRouter } from './index'

// Mock heavy page components so tests don't need API calls / CSS modules
vi.mock('@/features/dashboard', () => ({
  DashboardLayout: () => <div data-testid="dashboard" />,
}))

vi.mock('@/features/welcome', () => ({
  WelcomeScreen: () => <div data-testid="welcome" />,
}))

describe('AppRouter', () => {
  it('redirects / to /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('welcome')).not.toBeInTheDocument()
  })

  it('renders DashboardLayout at /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('renders WelcomeScreen at /welcome', () => {
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('welcome')).toBeInTheDocument()
  })

  it('redirects unknown paths to /dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/not-a-real-route']}>
        <AppRouter />
      </MemoryRouter>
    )
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('welcome')).not.toBeInTheDocument()
  })
})
