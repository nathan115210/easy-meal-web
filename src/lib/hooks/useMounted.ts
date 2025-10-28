import { useSyncExternalStore } from 'react';

function useMounted(): boolean {
  // On the server: always false. On the client: flip to true after mount.
  return useSyncExternalStore(
    (notify) => {
      const id = requestAnimationFrame(() => notify());
      return () => cancelAnimationFrame(id);
    },
    () => true,
    () => false
  );
}

export default useMounted;
