import Image from 'next/image';
import styles from '../page.module.scss';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import BaseLink from '@/components/baseLink/BaseLink';
import Button from '@/components/button/Button';

export default function EmptyList({ search }: { search?: string }) {
  const hasFilter = !!search;

  const img = !hasFilter ? '/broken-dish.svg' : '/empty-dish.svg';
  const heading = hasFilter ? 'No matching meals found' : 'Meals unavailable';
  const content = hasFilter
    ? 'We couldn’t find any meals that match your search. Try adjusting your keywords or exploring another category.'
    : 'Unable to load meals at the moment.';

  return (
    <div className={styles.emptyList}>
      <h1>{heading}</h1>
      <p>{content}</p>
      <Image src={img} alt={'No more results for'} width={'300'} height={'300'}></Image>

      <ButtonGroup>
        {hasFilter ? (
          <BaseLink href={'/meals'} variant={'primary'}>
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
