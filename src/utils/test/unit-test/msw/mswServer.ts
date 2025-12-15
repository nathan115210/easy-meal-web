import { setupServer } from 'msw/node';
import { mockHandlers } from '@/utils/test/unit-test/msw/mocks/mockHandlers';

export const mswServer = setupServer(...mockHandlers);
