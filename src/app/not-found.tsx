import React from 'react';
import NotFound from '@/components/NotFound/NotFound';

export default function NotFoundPage() {
  return <NotFound ctaHref={'/'} ctaText={'Go Home'} message={'Sorry, the page you are looking for does not exist.'} />;
}
