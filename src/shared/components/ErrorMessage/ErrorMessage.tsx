import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        {onRetry && (
          <button
            className={`neo-button neo-button-primary ${styles.button}`}
            onClick={onRetry}
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            className={`neo-button ${styles.button}`}
            onClick={onDismiss}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
