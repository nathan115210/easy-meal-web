'use client';

import React, { useMemo } from 'react';
import Button from '@/components/button/Button';
import { Pause, Play, RotateCcw, Square } from 'lucide-react';
import { useSpeechSteps } from '@/utils/hooks/useSpeechSteps';
import { MealInstruction } from '@/utils/types/meals';

type CookingNavigatorProps = {
  steps: MealInstruction[];
};

type SpeechStatus = 'idle' | 'speaking' | 'paused';

type ActionKey = 'start' | 'pause' | 'resume' | 'stop';

type ActionConfig = {
  key: ActionKey;
  icon?: React.ReactNode;
  label?: string;
  ariaLabel: string;
  variant: 'primary' | 'secondary' | 'primary-outline' | 'ghost';
  iconOnly?: boolean;
  onClick: () => void;
};

export function CookingNavigator({ steps }: CookingNavigatorProps) {
  const { isSupported, status, currentIndex, speakAll, pause, resume, stop } = useSpeechSteps(
    steps.map((step) => step.text),
    {
      lang: 'en-US', //TODO: give different lang according t user's preference
      rate: 1,
      prefixStepNumber: true,
    }
  );

  const actionsByStatus = useMemo<Record<SpeechStatus, ActionConfig[]>>(
    () => ({
      idle: [
        {
          key: 'start',
          icon: <Play size={18} />,
          label: 'Cook Navigator',
          ariaLabel: 'Start cook navigator',
          variant: 'primary-outline',
          iconOnly: false,
          onClick: speakAll,
        },
      ],
      speaking: [
        {
          key: 'pause',
          icon: <Pause size={18} />,
          ariaLabel: 'Pause reading',
          variant: 'secondary',
          iconOnly: true,
          onClick: pause,
        },
        {
          key: 'stop',
          icon: <Square size={18} />,
          ariaLabel: 'Stop reading',
          variant: 'primary-outline',
          iconOnly: true,
          onClick: stop,
        },
      ],
      paused: [
        {
          key: 'resume',
          icon: <RotateCcw size={18} />,
          ariaLabel: 'Resume reading',
          variant: 'secondary',
          iconOnly: true,
          onClick: resume,
        },
        {
          key: 'stop',
          icon: <Square size={18} />,
          ariaLabel: 'Stop reading',
          variant: 'primary-outline',
          iconOnly: true,
          onClick: stop,
        },
      ],
    }),
    [pause, resume, speakAll, stop]
  );

  if (!isSupported) return null;

  const actions = actionsByStatus[status];

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {actions.map((a) => (
        <Button
          key={a.key}
          variant={a.variant}
          onClick={a.onClick}
          iconOnly={a.iconOnly}
          aria-label={a.ariaLabel}
          title={a.ariaLabel}
        >
          {a.icon}
          {!a.iconOnly && a.label}
        </Button>
      ))}

      {currentIndex >= 0 && (
        <span
          aria-live="polite"
          style={{ fontSize: 14, opacity: 0.75, marginLeft: 8, fontWeight: 'bold' }}
        >
          Step {currentIndex + 1}/{steps.length}
        </span>
      )}
    </div>
  );
}
