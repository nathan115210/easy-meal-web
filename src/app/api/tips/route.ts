import { LiveTipItem } from '@/utils/types/liveTips';

const tips: Omit<LiveTipItem, 'sentAt'>[] = [
  {
    id: '0d3b3b7e-4d45-4d85-9cc2-7f8d9f6d4d11',
    icon: 'ChefHat',
    label: 'Prep ingredients before heating the pan.',
  },
  {
    id: '6311fd36-3328-4926-bb53-1b892d22bf2f',
    icon: 'BookOpen',
    label: 'Read the recipe once before you start cooking.',
  },
  {
    id: '341f7d27-e7a7-4868-a2d6-25b7f596e4a4',
    icon: 'Flame',
    label: 'Preheat your pan before adding oil for a better sear.',
  },
  {
    id: '4ebbf27c-a7ca-40b9-a0ff-8e7a377efabf',
    icon: 'MapIcon',
    label: 'Group ingredients by step to reduce kitchen backtracking.',
  },
  {
    id: '6c6ec9c5-dd46-4e96-8dca-a11204d77e0e',
    icon: 'Timer',
    label: 'Set a timer before multitasking so nothing overcooks.',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const indexParam = searchParams.get('index');
  const selectedTip =
    indexParam !== null
      ? tips[Number(indexParam) % tips.length]
      : tips[Math.floor(Math.random() * tips.length)];

  const tip: LiveTipItem = {
    ...selectedTip,
    sentAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify({ tip }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
