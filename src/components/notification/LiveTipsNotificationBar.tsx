'use client';

import { BookOpen, ChefHat, Flame, MapIcon, Timer, type LucideIcon } from 'lucide-react';
import useLiveTips from '@/utils/hooks/useLiveTips';
import type { LiveTipIcon } from '@/utils/types/liveTips';
import NotificationBar from './NotificationBar';
import styles from './notification.module.scss';

const liveTipIcons: Record<LiveTipIcon, LucideIcon> = {
  BookOpen,
  ChefHat,
  Flame,
  MapIcon,
  Timer,
};

function LiveTipsNotificationBar() {
  const { notificationState, connectionStatus, disconnect } = useLiveTips();

  if (
    connectionStatus === 'error' ||
    connectionStatus === 'closed' ||
    notificationState.kind === 'idle' ||
    notificationState.kind === 'error'
  ) {
    return null;
  }

  const Icon = liveTipIcons[notificationState.tip.icon];

  const tipKey = `${notificationState.tip.id}-${notificationState.tip.sentAt}`;

  return (
    <div key={tipKey} className={styles.flipUp}>
      <div className={styles.flipUpSlide}>
        <NotificationBar
          dismissible
          onDismiss={() => disconnect()}
          icon={<Icon size={18} aria-hidden />}
          message={notificationState.tip.label}
          type="brand"
        />
      </div>
    </div>
  );
}
export default LiveTipsNotificationBar;
