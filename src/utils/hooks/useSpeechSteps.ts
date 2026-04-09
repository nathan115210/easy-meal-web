'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechStatus = 'idle' | 'speaking' | 'paused';

type UseSpeechStepsOptions = {
  lang?: string; // e.g. 'en-US'
  rate?: number; // 0.1 - 10 (typical 0.9~1.1)
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
  voiceNameIncludes?: string; // optional: pick a specific voice
  prefixStepNumber?: boolean; // say "Step 1" before each step
};

function pickVoice(voices: SpeechSynthesisVoice[], opts: UseSpeechStepsOptions) {
  if (!voices.length) return null;

  if (opts.voiceNameIncludes) {
    const v = voices.find((x) =>
      x.name.toLowerCase().includes(opts.voiceNameIncludes!.toLowerCase())
    );
    if (v) return v;
  }

  if (opts.lang) {
    const v = voices.find((x) => x.lang?.toLowerCase().startsWith(opts.lang!.toLowerCase()));
    if (v) return v;
  }

  return voices[0] ?? null;
}

export function useSpeechSteps(steps: string[], options: UseSpeechStepsOptions = {}) {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Keep latest steps in a ref to avoid stale closures
  const stepsRef = useRef<string[]>(steps);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  // init speech synthesis once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const synth = synthRef.current;
      if (!synth) return;
      const voices = synth.getVoices();
      voicesRef.current = voices;
      voiceRef.current = pickVoice(voices, options);
    };

    loadVoices();
    // Some browsers load voices async
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = useCallback(() => {
    const synth = synthRef.current;
    if (!synth) return;

    synth.cancel();
    setStatus('idle');
    setCurrentIndex(-1);
  }, []);

  const pause = useCallback(() => {
    const synth = synthRef.current;
    if (!synth) return;

    if (synth.speaking && !synth.paused) {
      synth.pause();
      setStatus('paused');
    }
  }, []);

  const resume = useCallback(() => {
    const synth = synthRef.current;
    if (!synth) return;

    if (synth.paused) {
      synth.resume();
      setStatus('speaking');
    }
  }, []);

  const speakFrom = useCallback(
    (startIndex: number) => {
      const synth = synthRef.current;
      if (!synth) return;

      // Cancel any existing queue
      synth.cancel();

      const stepsNow = stepsRef.current.filter(Boolean);
      if (stepsNow.length === 0) return;

      const safeStart = Math.max(0, Math.min(startIndex, stepsNow.length - 1));

      const speakOne = (idx: number) => {
        const text = stepsNow[idx];
        if (!text) return;

        setCurrentIndex(idx);
        setStatus('speaking');

        const utter = new SpeechSynthesisUtterance(
          options.prefixStepNumber ? `Step ${idx + 1}. ${text}` : text
        );

        utter.lang = options.lang ?? 'en-US';
        utter.rate = options.rate ?? 1;
        utter.pitch = options.pitch ?? 1;
        utter.volume = options.volume ?? 1;

        const chosenVoice = voiceRef.current;
        if (chosenVoice) utter.voice = chosenVoice;

        utter.onend = () => {
          // If we were stopped/cancelled, don’t continue
          const s = synthRef.current;
          if (!s || s.speaking || s.paused) return;

          const next = idx + 1;
          if (next < stepsNow.length) {
            speakOne(next);
          } else {
            setStatus('idle');
            setCurrentIndex(-1);
          }
        };

        utter.onerror = () => {
          setStatus('idle');
          setCurrentIndex(-1);
        };

        synth.speak(utter);
      };

      speakOne(safeStart);
    },
    [options.lang, options.pitch, options.prefixStepNumber, options.rate, options.volume]
  );

  const speakAll = useCallback(() => speakFrom(0), [speakFrom]);

  // Clean up when unmounting (important in App Router)
  useEffect(() => stop, [stop]);

  return {
    status,
    currentIndex,
    speakAll,
    speakFrom,
    pause,
    resume,
    stop,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
}
