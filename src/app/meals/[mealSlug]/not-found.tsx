import NotFound from '@/components/NotFound/NotFound';

export default function NotFoundPage() {
  return (
    <NotFound
      message={"Sorry, we couldn't find that meal."}
      ctaHref={'/meals'}
      ctaText={'Browse all meals'}
    />
  );
}
