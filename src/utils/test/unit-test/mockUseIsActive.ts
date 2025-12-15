import { type MockedFunction, vi } from 'vitest';
/** import the mocked hook */
import useIsActive from '@/utils/hooks/useIsActive';

/** Hoist the module mock first */
vi.mock('@/utils/hooks/useIsActive', () => ({
  __esModule: true,
  default: vi.fn(), // the hook; we'll set its return later
}));

type Predicate = (href: string) => boolean;
type UseIsActiveHook = () => Predicate;

/** The mocked hook typed as a mocked function */
export const useIsActiveMock = useIsActive as unknown as MockedFunction<UseIsActiveHook>;

/** Set which hrefs are active. Returns the predicate spy for assertions. */
export function mockActive(hrefs: string[] = []) {
  const predicate = vi.fn<Predicate>((href) => hrefs.includes(href));
  useIsActiveMock.mockReturnValue(predicate);
  return predicate;
}

/** Reset between tests */
export function resetActiveMock() {
  useIsActiveMock.mockReset();
}
