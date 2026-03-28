import { Layout } from '@/shared/components/Layout'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { config } from '@/core/config'
import styles from './WelcomeScreen.module.css'

/**
 * WelcomeScreen Component
 * 
 * Initial landing page that welcomes users and demonstrates
 * the organized project structure.
 */
export function WelcomeScreen() {
  const handleGetStarted = () => {
    console.log('Getting started...')
  }

  return (
    <Layout
      header={
        <div className={styles.headerContent}>
          <h1>{config.app.title}</h1>
          <span className={styles.version}>v{config.app.version}</span>
        </div>
      }
    >
      <div className={styles.container}>
        <div className={styles.hero}>
          <h2>Welcome to Your React Project Foundation</h2>
          <p className={styles.subtitle}>
            A modern, well-structured React application with TypeScript, Vite, and best practices
          </p>
        </div>

        <div className={styles.grid}>
          <Card title="🚀 Quick Start" hoverable>
            <p>Ready to build something amazing?</p>
            <ul className={styles.list}>
              <li>TypeScript for type safety</li>
              <li>Vite for lightning-fast HMR</li>
              <li>Feature-based architecture</li>
            </ul>
          </Card>

          <Card title="📁 Organized Structure" hoverable>
            <p>Everything has its place:</p>
            <ul className={styles.list}>
              <li>Features in src/features/</li>
              <li>Shared components in src/shared/</li>
              <li>Core utilities in src/core/</li>
            </ul>
          </Card>

          <Card title="🧪 Testing Ready" hoverable>
            <p>Quality built-in from day one:</p>
            <ul className={styles.list}>
              <li>Vitest for unit testing</li>
              <li>React Testing Library</li>
              <li>Example tests included</li>
            </ul>
          </Card>

          <Card title="🎨 Code Quality" hoverable>
            <p>Consistent, maintainable code:</p>
            <ul className={styles.list}>
              <li>ESLint for code quality</li>
              <li>Prettier for formatting</li>
              <li>TypeScript strict mode</li>
            </ul>
          </Card>
        </div>

        <div className={styles.actions}>
          <Button label="Get Started" variant="primary" onClick={handleGetStarted} />
          <Button
            label="View Documentation"
            variant="outline"
            onClick={() => console.log('Opening docs...')}
          />
        </div>
      </div>
    </Layout>
  )
}
