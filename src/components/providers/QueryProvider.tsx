'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';

type Props = { children: ReactNode };

export default function QueryProvider({ children }: Props) {
  // Create one QueryClient per browser session
  const [client] = useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
