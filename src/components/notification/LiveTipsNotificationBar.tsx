'use client';

import { BookOpen, ChefHat, Flame, MapIcon, Sparkles, Timer, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
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
  const { notificationState, connectionStatus } = useLiveTips();
  const [dismissed, setDismissed] = useState<string | null>(null);

  if (
    connectionStatus === 'error' ||
    connectionStatus === 'closed' ||
    notificationState.kind === 'idle' ||
    notificationState.kind === 'error'
  ) {
    return null;
  }

  const tipKey = `${notificationState.tip.id}-${notificationState.tip.sentAt}`;

  if (dismissed === tipKey) {
    return null;
  }

  const Icon = liveTipIcons[notificationState.tip.icon] ?? Sparkles;

  return (
    <div key={tipKey} className={styles.flipUp}>
      <div className={styles.flipUpSlide}>
        <NotificationBar
          dismissible
          onDismiss={() => setDismissed(tipKey)}
          icon={<Icon size={18} aria-hidden />}
          message={notificationState.tip.label}
          type="brand"
        />
      </div>
    </div>
  );
}
export default LiveTipsNotificationBar;
