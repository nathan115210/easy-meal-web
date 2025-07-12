import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Easy meal - all meals',
};

export default function MealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Meals Layout</h1>
      {children}
    </div>
  );
}
