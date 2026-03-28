import { ReactNode, HTMLAttributes } from 'react'
import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode
  /** Optional card title */
  title?: string
  /** Optional card footer */
  footer?: ReactNode
  /** Adds hover effect */
  hoverable?: boolean
}

/**
 * Card Component
 * 
 * A flexible container component for grouping related content.
 * Supports optional title and footer sections.
 * 
 * @example
 * ```tsx
 * <Card title="My Card" hoverable>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export function Card({
  children,
  title,
  footer,
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    hoverable ? styles.hoverable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...props}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}
