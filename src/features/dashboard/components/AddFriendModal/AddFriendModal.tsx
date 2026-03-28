import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/Loading';
import { FriendPreview } from '@/features/dashboard/components/FriendPreview';
import type { Friend, LeetCodeUser } from '@/features/dashboard/types';
import { fetchUserStats } from '@/features/dashboard/services/leetcodeApi';
import styles from './AddFriendModal.module.css';

export interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (friend: Friend) => void;
  existingFriends: string[];
  currentUsername?: string;
}

type Step = 'input' | 'preview' | 'loading' | 'error';

/**
 * Modal for adding new friends to leaderboard
 * Features: username input, validation, preview, and confirmation
 */
export function AddFriendModal({
  isOpen,
  onClose,
  onAddFriend,
  existingFriends,
  currentUsername,
}: AddFriendModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [username, setUsername] = useState('');
  const [previewData, setPreviewData] = useState<LeetCodeUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal closes
  const handleClose = () => {
    setStep('input');
    setUsername('');
    setPreviewData(null);
    setError(null);
    onClose();
  };

  // Validate username
  const validateUsername = (name: string): string | null => {
    if (!name.trim()) {
      return 'Username cannot be empty';
    }

    if (currentUsername && name.toLowerCase() === currentUsername.toLowerCase()) {
      return 'You cannot add yourself as a friend';
    }

    if (existingFriends.some(f => f.toLowerCase() === name.toLowerCase())) {
      return 'This friend is already added';
    }

    return null;
  };

  // Fetch user stats and show preview
  const handleFetchUser = async () => {
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setStep('loading');
    setError(null);

    try {
      const userStats = await fetchUserStats(username);
      setPreviewData(userStats);
      setStep('preview');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user stats';
      setError(errorMessage);
      setStep('error');
    }
  };

  // Add friend
  const handleAddFriend = () => {
    if (!previewData) return;

    const newFriend: Friend = {
      ...previewData,
      rankPosition: 0,
      previousRankPosition: null,
      trendDirection: 'stable',
      isInactive: false,
      isImproving: false,
      lastActivityTimestamp: Date.now(),
      addedAt: Date.now(),
    };

    onAddFriend(newFriend);
    handleClose();
  };

  // Retry after error
  const handleRetry = () => {
    setStep('input');
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Friend">
      <div className={styles.content}>
        {/* Input Step */}
        {step === 'input' && (
          <div className={styles.inputStep}>
            <p className={styles.description}>
              Enter your friend's LeetCode username to add them to your leaderboard
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                LeetCode Username
              </label>
              <input
                id="username"
                type="text"
                className={styles.input}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchUser()}
                placeholder="e.g., aditya_raj"
                autoComplete="off"
                autoFocus
              />
            </div>

            {error && (
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            )}

            <div className={styles.actions}>
              <button className={styles.secondaryButton} onClick={handleClose}>
                Cancel
              </button>
              <button 
                className={styles.primaryButton}
                onClick={handleFetchUser}
                disabled={!username.trim()}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Loading Step */}
        {step === 'loading' && (
          <div className={styles.loadingStep}>
            <LoadingSpinner size="large" message="Fetching user stats..." />
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && previewData && (
          <FriendPreview
            user={previewData}
            onAdd={handleAddFriend}
            onCancel={handleClose}
          />
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className={styles.errorStep}>
            <ErrorMessage 
              message={error || 'An unknown error occurred'} 
              onRetry={handleRetry}
              onDismiss={handleClose}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
