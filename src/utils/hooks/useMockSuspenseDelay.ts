let delayDone = false;
let delayPromise: Promise<void> | null = null;

export default function useMockSuspenseDelay(ms = 5000) {
  if (typeof window === 'undefined' || delayDone) return;
  console.log('Delaying for suspense...');
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
