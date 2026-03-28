import { useState, type FormEvent } from 'react';
import styles from './UsernameSetup.module.css';

interface UsernameSetupProps {
  onUsernameSubmit: (username: string) => void;
  isOpen: boolean;
}

export default function UsernameSetup({ onUsernameSubmit, isOpen }: UsernameSetupProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate username
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }

    // Basic alphanumeric validation
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setError('');
    onUsernameSubmit(trimmedUsername);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h1 className={styles.title}>🏆 Welcome to LeetCode Competitor</h1>
          <p className={styles.subtitle}>Enter your LeetCode username to get started</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              LeetCode Username
            </label>
            <input
              id="username"
              type="text"
              className={`neo-input ${styles.input}`}
              placeholder="e.g., john_doe"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              autoFocus
              autoComplete="off"
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <button type="submit" className={`neo-button neo-button-primary ${styles.submitButton}`}>
            Start Competing
          </button>
        </form>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span className={styles.featureText}>Track your progress</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚔️</span>
            <span className={styles.featureText}>Compete with friends</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🏅</span>
            <span className={styles.featureText}>Earn achievements</span>
          </div>
        </div>
      </div>
    </div>
  );
}
