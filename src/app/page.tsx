import styles from './page.module.scss';
import TopBar from '@/components/topBar/TopBar';
import Banner from '@/components/banner/Banner';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import Button, { ButtonProps } from '@/components/button/Button';
import BaseLink from '@/components/baseLink/BaseLink';
import Card from '@/components/card/Card';
import { Col, Grid, Row } from '@/components/grid/Grid';
import homePageContents from '@/utils/constants/homePageContents';
import { ArrowRightIcon } from 'lucide-react';

export default function Home() {
  const { heroBanner, featuresSection } = homePageContents;

  return (
    <div className={styles.homePage}>
      <TopBar />
      <Banner
        heading={heroBanner.heading}
        description={heroBanner.description}
        bannerImageSet={heroBanner.bannerImageSet}
        imagePosition={heroBanner.imagePosition}
        bannerImageAlt={heroBanner.bannerImageAlt}
      >
        <ButtonGroup>
          {heroBanner.ctaGroup?.map((ctItem, index: number) => {
            if (ctItem.type === 'link') {
              return (
                <BaseLink
                  key={index}
                  href={ctItem.href}
                  variant={ctItem.variant}
                  underline={ctItem.underline}
                  pressed={ctItem.pressed}
                >
                  {ctItem.children}
                </BaseLink>
              );
            } else if (ctItem.type === 'button') {
              return (
                <Button key={index} variant={(ctItem as ButtonProps).variant}>
                  {ctItem.children}
                </Button>
              );
            }
          })}
        </ButtonGroup>
      </Banner>

      <Grid>
        <Row>
          {featuresSection.map((featureItem, i) => (
            <Col key={i} sm={12} lg={6}>
              <Banner
                heading={featureItem.heading}
                description={featureItem.description}
                bannerImageSet={featureItem.bannerImageSet}
                bannerImageAlt={featureItem.bannerImageAlt}
              >
                <BaseLink
                  href={featureItem.link.href}
                  variant={featureItem.link.variant}
                  underline={featureItem.link.underline}
                  //pressed={featureItem.link.pressed}
                >
                  {featureItem.link.children}
                  <ArrowRightIcon aria-hidden="true" />
                </BaseLink>
              </Banner>
            </Col>
          ))}
        </Row>
      </Grid>
      <Grid>
        <Row>
          {Array.from(Array(10).keys()).map((_, i) => (
            <Col key={i} sm={12} md={6} lg={4} xl={3}>
              <Card
                heading={'Smart Recipe Search'}
                imageSet={{ mobileSrc: '/placeholder.png' }}
                imageAlt={'Smart Recipe Search'}
                description={'Filter by ingredients, diet, and time. Find the perfect meal fast.'}
              >
                <ButtonGroup>
                  <BaseLink href={'/google'} variant={'primary'} underline={'hover'} pressed>
                    Start Planning
                  </BaseLink>
                  <Button variant={'secondary'}>Browse Recipes</Button>
                </ButtonGroup>
              </Card>
            </Col>
          ))}
        </Row>
      </Grid>
    </div>
  );
}
