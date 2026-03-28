import { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text label */
  label: string
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline'
  /** Full width button */
  fullWidth?: boolean
}

/**
 * Button Component
 * 
 * A reusable button component with multiple visual variants.
 * Extends standard HTML button attributes for full flexibility.
 * 
 * @example
 * ```tsx
 * <Button label="Click me" variant="primary" onClick={() => console.log('clicked')} />
 * ```
 */
export function Button({
  label,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classNames} {...props}>
      {label}
    </button>
  )
}
