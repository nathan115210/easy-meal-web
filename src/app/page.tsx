import styles from './page.module.scss';
import Banner from '@/components/banner/Banner';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import Button, { ButtonProps } from '@/components/button/Button';
import BaseLink from '@/components/baseLink/BaseLink';
import { Col, Grid, Row } from '@/components/grid/Grid';
import homePageContents from '@/utils/constants/homePageContents';
import { ArrowRightIcon } from 'lucide-react';

export default function Home() {
  const { heroBanner, featuresSection } = homePageContents;

  return (
    <div className={styles.homePage}>
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
                >
                  {featureItem.link.children}
                  <ArrowRightIcon aria-hidden="true" />
                </BaseLink>
              </Banner>
            </Col>
          ))}
        </Row>
      </Grid>
    </div>
  );
}
