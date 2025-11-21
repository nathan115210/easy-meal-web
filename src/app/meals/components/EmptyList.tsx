import Image from 'next/image';
import styles from '../page.module.scss';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import BaseLink from '@/components/baseLink/BaseLink';

export default function EmptyList({ search, category }: { search?: string; category?: string }) {
  const hasFilter = !!search || !!category;

  const heading = hasFilter ? 'No matching meals found' : 'Nothing found';
  const content = hasFilter
    ? 'We couldn’t find any meals that match your search. Try adjusting your keywords or exploring another category.'
    : '';

  return (
    <div className={styles.emptyList}>
      <h1>{heading}</h1>
      <p>{content}</p>
      <Image src={'/empty.svg'} alt={'No more results for'} width={'300'} height={'300'}></Image>
      <ButtonGroup>
        <BaseLink href={'/meals'} variant={'primary'}>
          {hasFilter ? 'Clear search' : 'Explore meals'}
        </BaseLink>
        <BaseLink href={'/'} variant={'secondary'}>
          Back to home
        </BaseLink>
      </ButtonGroup>
    </div>
  );
}
