export type LiveTipIcon = 'BookOpen' | 'ChefHat' | 'Flame' | 'MapIcon' | 'Timer';

export type LiveTipItem = {
  id: string;
  icon: LiveTipIcon;
  label: string;
  sentAt: string;
};

export type LiveTipsSocketEvent =
  | {
      type: 'connected';
      message: string;
      sentAt: string;
    }
  | {
      type: 'tip';
      tip: LiveTipItem;
    }
  | {
      type: 'error';
      message: string;
      sentAt: string;
    };
