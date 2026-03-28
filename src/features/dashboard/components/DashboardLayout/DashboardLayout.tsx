import { useState, useCallback } from 'react';
import UsernameSetup from '../UsernameSetup';
import HeroSection from '../HeroSection';
import { TopNavigation } from '../TopNavigation';
import { AddFriendModal } from '../AddFriendModal';
import { Leaderboard } from '../Leaderboard';
import ActivityFeed from '../ActivityFeed';
import PointsSystemCard from '../PointsSystemCard';
import { PerformanceCharts } from '../PerformanceCharts';
import { ToastContainer } from '@/shared/components/Toast';
import {
  useUserStats,
  useFriendsList,
  useLeaderboard,
  useActivityFeed,
} from '@/features/dashboard/hooks';
import { useTheme } from '@/shared/hooks/useTheme';
import { LocalStore, SessionStore } from '@/features/dashboard/services/storageManager';
import type { Friend } from '@/features/dashboard/types';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  username?: string;
  onUsernameChange?: (_username: string) => void;
}

interface Toast {
  id: string;
  message: string;
  icon?: string;
}

export default function DashboardLayout({
  username: initialUsername,
  onUsernameChange,
}: DashboardLayoutProps) {
  // Initialize username from localStorage or prop
  const [username, setUsername] = useState<string | null>(() => {
    const storedUsername = LocalStore.getUsername();
    return storedUsername || initialUsername || null;
  });

  // Show username setup if no username is available
  const [showUsernameSetup, setShowUsernameSetup] = useState(() => {
    const storedUsername = LocalStore.getUsername();
    return !storedUsername && !initialUsername;
  });
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Hooks
  const { user, loading, error, refresh, badges } = useUserStats(username);
  const [theme, toggleTheme] = useTheme();
  const { friends, addFriend, removeFriend } = useFriendsList();
  const { leaderboard, bestFriend } = useLeaderboard({
    friends,
    currentUsername: username || undefined,
  });
  const { activities, refresh: refreshActivities } = useActivityFeed({
    friends,
    maxEvents: 10,
  });

  const handleUsernameSubmit = useCallback(
    (newUsername: string) => {
      setUsername(newUsername);
      LocalStore.setUsername(newUsername);
      setShowUsernameSetup(false);
      onUsernameChange?.(newUsername);
    },
    [onUsernameChange]
  );

  const addToast = useCallback((message: string, icon?: string) => {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      icon,
    };
    setToasts((prev) => [...prev, toast]);
  }, []);

  const handleAddFriend = useCallback(
    async (friend: Friend) => {
      // Add friend to the list
      const addedFriend = await addFriend(friend.username);
      if (addedFriend) {
        addToast(`New Rival Added: ${friend.username} ⚔️`, '⚔️');
        // Refresh activities when a new friend is added
        setTimeout(() => refreshActivities(), 500);
      }
    },
    [addFriend, addToast, refreshActivities]
  );

  const handleRemoveFriend = useCallback(
    (friendUsername: string) => {
      removeFriend(friendUsername);
      addToast(`${friendUsername} removed from leaderboard`, '👋');
    },
    [removeFriend, addToast]
  );

  const handleChangeUsername = useCallback(() => {
    setShowUsernameSetup(true);
  }, []);

  const handleClearData = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to clear all data? This will remove all friends and reset your settings.'
      )
    ) {
      SessionStore.clear();
      LocalStore.clearUserCaches();
      addToast('All data cleared', '🗑️');
    }
  }, [addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (showUsernameSetup || !username) {
    return (
      <UsernameSetup
        isOpen={showUsernameSetup || !username}
        onUsernameSubmit={handleUsernameSubmit}
      />
    );
  }

  return (
    <div className={styles.container}>
      <TopNavigation
        username={username}
        todaySolved={user?.todaySolved || 0}
        currentStreak={user?.currentStreak || 0}
        totalPoints={user?.totalPoints || 0}
        theme={theme}
        onAddFriendClick={() => setShowAddFriendModal(true)}
        onThemeToggle={toggleTheme}
        onChangeUsername={handleChangeUsername}
        onClearData={handleClearData}
      />

      <div className={styles.content}>
        <HeroSection
          user={user}
          bestFriend={bestFriend || undefined}
          loading={loading}
          error={error || undefined}
          onRetry={refresh}
          badges={badges}
        />

        <Leaderboard
          entries={leaderboard}
          currentUsername={username}
          onRemoveFriend={handleRemoveFriend}
          loading={loading}
        />

        <ActivityFeed events={activities} maxEvents={10} loading={loading} />

        {user && <PerformanceCharts user={user} bestFriend={bestFriend || null} />}

        <PointsSystemCard showExamples={false} />
      </div>

      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        onAddFriend={handleAddFriend}
        existingFriends={friends.map((f) => f.username)}
        currentUsername={username}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
