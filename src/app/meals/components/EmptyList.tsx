import Image from 'next/image';
import styles from '../page.module.scss';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import BaseLink from '@/components/baseLink/BaseLink';
import Button from '@/components/button/Button';
import { CookTimeValue, MealType } from '@/utils/types/meals';

export default function EmptyList({
  search,
  mealType,
  cookTime,
  clearHref = '/meals',
}: {
  search?: string;
  mealType?: MealType[];
  cookTime?: CookTimeValue;
  clearHref?: string;
}) {
  const hasFilter = !!search || !!mealType || !!cookTime;

  const img = !hasFilter ? '/broken-dish.svg' : '/empty-dish.svg';
  const heading = hasFilter ? 'No matching meals found' : 'Meals unavailable';
  const content = hasFilter
    ? 'We couldn’t find any meals that match your search. Try adjusting your searching options.'
    : 'Unable to load meals at the moment.';

  return (
    <div className={styles.emptyList}>
      <h1>{heading}</h1>
      <p>{content}</p>
      <Image src={img} alt={'No more results for'} width={'300'} height={'300'}></Image>

      <ButtonGroup>
        {hasFilter ? (
          <BaseLink href={clearHref} variant={'primary'}>
            Clear search
          </BaseLink>
        ) : (
          <Button variant={'primary'} onClick={() => window.location.reload()}>
            Refresh
          </Button>
        )}

        <BaseLink href={'/'} variant={'secondary'}>
          Back to home
        </BaseLink>
      </ButtonGroup>
    </div>
  );
}
