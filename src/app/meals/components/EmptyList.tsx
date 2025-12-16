import Image from 'next/image';
import styles from '../page.module.scss';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import BaseLink from '@/components/baseLink/BaseLink';
import { CookTimeValue, MealType } from '@/utils/types/meals';

export default function EmptyList({
  search,
  mealType,
  cookTime,
  clearHref,
  ...rest
}: {
  search?: string;
  mealType?: MealType[];
  cookTime?: CookTimeValue;
  clearHref?: string;
  clearAction?: () => void;
}) {
  const hasFilter = !!search || !!mealType || !!cookTime;

  const img = !hasFilter ? '/broken-dish.svg' : '/empty-dish.svg';
  const heading = hasFilter ? 'No matching meals found' : 'Meals unavailable';
  const content = hasFilter
    ? 'We couldn’t find any meals that match your search. Try adjusting your searching options.'
    : 'Unable to load meals at the moment.';

  return (
    <div className={styles.emptyList} {...rest}>
      <h1>{heading}</h1>
      <p>{content}</p>
      <Image src={img} alt={'No more results for'} width={'300'} height={'300'}></Image>
      <ButtonGroup>
        {clearHref && (
          <BaseLink
            href={clearHref}
            variant={'primary'}
            replace
            data-testid={'emptyList-reviewAllMeals-cta'}
          >
            Review All Meals
          </BaseLink>
        )}

        <BaseLink href={'/'} variant={'secondary'} data-testid="emptyList-backToHome-cta">
          Back to home
        </BaseLink>
      </ButtonGroup>
    </div>
  );
}
