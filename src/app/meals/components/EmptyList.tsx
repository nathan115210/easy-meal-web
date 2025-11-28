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
  clearHref,
  clearAction,
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

  const renderClearActionEle = () => {
    if (hasFilter) {
      if (!!clearHref) {
        return (
          <BaseLink href={clearHref} variant={'primary'}>
            Clear search
          </BaseLink>
        );
      }
      if (!!clearAction) {
        return (
          <Button variant={'primary'} onClick={clearAction}>
            Clear search
          </Button>
        );
      }
    } else {
      return (
        <Button variant={'primary'} onClick={() => window.location.reload()}>
          Refresh
        </Button>
      );
    }
  };

  return (
    <div className={styles.emptyList}>
      <h1>{heading}</h1>
      <p>{content}</p>
      <Image src={img} alt={'No more results for'} width={'300'} height={'300'}></Image>
      <ButtonGroup>
        {renderClearActionEle()}

        <BaseLink href={'/'} variant={'secondary'}>
          Back to home
        </BaseLink>
      </ButtonGroup>
    </div>
  );
}
