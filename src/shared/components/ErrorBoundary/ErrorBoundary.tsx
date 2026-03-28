/**
 * ErrorBoundary Component
 *
 * React error boundary for graceful error handling.
 * Catches JavaScript errors in child components and displays a fallback UI.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (_error: Error, _errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.icon}>💥</div>
            <h1 className={styles.title}>Oops! Something went wrong</h1>
            <p className={styles.message}>
              We encountered an unexpected error. Don&apos;t worry, your data is safe.
            </p>

            {this.state.error && (
              <details className={styles.details}>
                <summary className={styles.detailsSummary}>Error Details</summary>
                <pre className={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button className={styles.resetButton} onClick={this.handleReset}>
              Try Again
            </button>

            <button className={styles.reloadButton} onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
