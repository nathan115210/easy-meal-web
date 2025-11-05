import styles from './page.module.scss';
import TopBar from '@/components/topBar/TopBar';
import Banner, { BannerImagePositionType } from '@/components/banner/Banner';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import Button from '@/components/button/Button';
import BaseLink from '@/components/baseLink/BaseLink';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <TopBar />
      <Banner
        heading={'Cook smarter with AI-powered recipes'}
        description={
          'Plan your week, generate shopping lists, and learn from a community of home cooks. Four focused tools to run your kitchen with ease.'
        }
        bannerImageSet={{ mobileSrc: '/placeholder.png' }}
        imagePosition={BannerImagePositionType.RIGHT}
      >
        <ButtonGroup>
          <BaseLink href={'/google'} variant={'primary'} underline={'hover'} pressed>
            Start Planning
          </BaseLink>
          <Button variant={'secondary'}>Browse Recipes</Button>
        </ButtonGroup>
      </Banner>
    </div>
  );
}
