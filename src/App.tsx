import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './core/router'
import { useTheme } from './shared/hooks/useTheme'

function App() {
  useTheme();

  return (
    <BrowserRouter basename="/LeetCode-Competitor">
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
