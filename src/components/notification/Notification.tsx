'use client';

import React from 'react';
import { AlertTriangle, Bell, CheckCircle, Info, MessageSquare, Minus, Sparkles, X, XCircle } from 'lucide-react';
import styles from './notification.module.scss';

export type NotificationType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'brand'
  | 'muted'
  | 'successFilled'
  | 'warningFilled'
  | 'errorFilled'
  | 'brandFilled'
  | 'reminder';

export type NotificationProps = {
  icon?: React.ReactNode;
  message: React.ReactNode;
  type?: NotificationType;
  onDismiss?: () => void;
};

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle size={18} aria-hidden />,
  warning: <AlertTriangle size={18} aria-hidden />,
  error: <XCircle size={18} aria-hidden />,
  info: <Info size={18} aria-hidden />,
  neutral: <Minus size={18} aria-hidden />,
  brand: <Sparkles size={18} aria-hidden />,
  muted: <MessageSquare size={18} aria-hidden />,
  successFilled: <CheckCircle size={18} aria-hidden />,
  warningFilled: <AlertTriangle size={18} aria-hidden />,
  errorFilled: <XCircle size={18} aria-hidden />,
  brandFilled: <Sparkles size={18} aria-hidden />,
  reminder: <Bell size={18} aria-hidden />,
};

function Notification({ icon, message, type = 'info', onDismiss }: NotificationProps) {
  return (
    <div
      className={`${styles.notification} ${styles[type]}`}
      role="alert"
      aria-live="polite"
      data-testid="global-notification"
    >
      <span className={styles.icon}>{icon ?? icons[type]}</span>
      <p className={styles.message}>{message}</p>
      {onDismiss && (
        <button
          type="button"
          className={styles.close}
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}

export default Notification;
