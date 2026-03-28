import { useEffect } from 'react';
import styles from './Toast.module.css';

export interface ToastProps {
  message: string;
  icon?: string;
  duration?: number;
  onClose?: () => void;
}

/**
 * Toast notification component
 * Displays a temporary message with animation
 */
export function Toast({ 
  message, 
  icon = '⚔️', 
  duration = 3000, 
  onClose 
}: ToastProps) {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={styles.toast}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; icon?: string }>;
  onRemove: (id: string) => void;
}

/**
 * Toast container for managing multiple toasts
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          icon={toast.icon}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
