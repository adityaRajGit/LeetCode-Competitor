import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './core/router'
import { useTheme } from './shared/hooks/useTheme'

function App() {
  // Initialize theme system
  useTheme();

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
