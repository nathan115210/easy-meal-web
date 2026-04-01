'use client';

import { useState } from 'react';
import Notification, { type NotificationProps } from './Notification';

type NotificationBarProps = Omit<NotificationProps, 'onDismiss'> & {
  dismissible?: boolean;
  onDismiss?: () => void;
};

function NotificationBar({ dismissible = true, ...props }: NotificationBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const onDismissHandler = dismissible
    ? () => {
        setVisible(false);
        props.onDismiss?.();
      }
    : undefined;

  return <Notification {...props} onDismiss={onDismissHandler} />;
}

export default NotificationBar;
