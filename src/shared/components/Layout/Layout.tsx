import { ReactNode } from 'react'
import styles from './Layout.module.css'

export interface LayoutProps {
  /** Main content to render */
  children: ReactNode
  /** Optional header content */
  header?: ReactNode
}

/**
 * Layout Component
 * 
 * Provides the main page structure with header and content areas.
 * Use this as a wrapper for all page content to maintain consistent layout.
 * 
 * @example
 * ```tsx
 * <Layout header={<h1>My App</h1>}>
 *   <p>Page content</p>
 * </Layout>
 * ```
 */
export function Layout({ children, header }: LayoutProps) {
  return (
    <div className={styles.layout}>
      {header && <header className={styles.header}>{header}</header>}
      <main className={styles.main}>{children}</main>
    </div>
  )
}
