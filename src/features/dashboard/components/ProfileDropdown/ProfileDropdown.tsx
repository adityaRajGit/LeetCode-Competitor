import { useState, useRef, useEffect } from 'react';
import styles from './ProfileDropdown.module.css';

export interface ProfileDropdownProps {
  username: string;
  onChangeUsername?: () => void;
  onClearData?: () => void;
  onViewProfile?: () => void;
}

/**
 * Profile dropdown menu
 * Shows user options including change username, clear data, etc.
 */
export function ProfileDropdown({ 
  username, 
  onChangeUsername,
  onClearData,
  onViewProfile,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button 
        className={styles.trigger}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.avatar}>
          {username.charAt(0).toUpperCase()}
        </div>
        <span className={styles.username}>{username}</span>
        <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {onViewProfile && (
            <button 
              className={styles.menuItem}
              onClick={() => handleAction(onViewProfile)}
            >
              <span className={styles.menuIcon}>👤</span>
              <span>View Profile</span>
            </button>
          )}

          {onChangeUsername && (
            <button 
              className={styles.menuItem}
              onClick={() => handleAction(onChangeUsername)}
            >
              <span className={styles.menuIcon}>✏️</span>
              <span>Change Username</span>
            </button>
          )}

          {onClearData && (
            <>
              <div className={styles.divider} />
              <button 
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => handleAction(onClearData)}
              >
                <span className={styles.menuIcon}>🗑️</span>
                <span>Clear All Data</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
