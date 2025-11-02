let delayDone = false;
let delayPromise: Promise<void> | null = null;

export default function useMockSuspenseDelay(ms = 9000000) {
  if (typeof window === 'undefined' || delayDone) return;

  if (!delayPromise) {
    delayPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        delayDone = true;
        resolve();
      }, ms);
    });
  }
  throw delayPromise;
}
