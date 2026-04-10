import styles from './page.module.scss';
import TopBar from '@/components/topBar/TopBar';
import RecipeCard from '@/components/recipeCard/RecipeCard';
import { Col, Row } from '@/components/grid/Grid';
import FeatureBanner from '@/components/featureBanner/FeatureBanner';
import homePageContents from '@/utils/constants/homePageContents';
import { ArrowRight, Search, Calendar, ShoppingCart, MessageSquare, Sparkles } from 'lucide-react';
import type { FeatureBannerIconName } from '@/utils/constants/homePageContents';
import Link from 'next/link';
import type { ReactElement } from 'react';

const featureIconMap: Record<FeatureBannerIconName, ReactElement> = {
  search: <Search size={24} aria-hidden="true" />,
  calendar: <Calendar size={24} aria-hidden="true" />,
  'shopping-cart': <ShoppingCart size={24} aria-hidden="true" />,
  'message-square': <MessageSquare size={24} aria-hidden="true" />,
};

export default function Home() {
  const { hero, trendingRecipes, featureBanners } = homePageContents;
  return (
    <div className={styles.homePage}>
      <TopBar />

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.heroEyebrow}>{hero.eyebrow}</span>
          <h1 className={styles.heroHeading}>
            {hero.heading}
            <br />
            <em className={styles.heroEmphasis}>{hero.headingEmphasis}</em> cook.
          </h1>
        </div>
        <Link href={hero.ctaHref} className={styles.heroCta}>
          {hero.ctaText}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </header>

      {/* ── Today's Highlights ── */}
      <section className={styles.section} aria-labelledby="highlights-heading">
        <div className={styles.sectionHeader}>
          <h2 id="highlights-heading" className={styles.sectionTitle}>
            Today&apos;s Highlights
          </h2>
          <p className={styles.sectionSubtitle}>Curated selections for your kitchen.</p>
        </div>
        <Row>
          {trendingRecipes.map((recipe, i) => (
            <Col key={`trending-recipe-${recipe.id}-${i}`} sm={12} md={6} xl={4}>
              <RecipeCard {...recipe} />
            </Col>
          ))}
        </Row>
      </section>

      {/* ── A Connected System ── */}
      <section className={styles.section} aria-labelledby="system-heading">
        <div className={styles.featureIntro}>
          <h2 id="system-heading" className={styles.featureIntroTitle}>
            A connected system.
          </h2>
          <p className={styles.featureIntroText}>
            We&apos;ve redesigned every touchpoint of your cooking journey to feel as good as it
            tastes.
          </p>
        </div>
        <Row>
          {featureBanners.map((banner, i) => {
            const isFullWidth = banner.variant === 'overlayLeft' || banner.variant === 'split';

            return (
              <Col key={`feature-banner-${i}`} sm={12} md={isFullWidth ? 12 : 6}>
                <FeatureBanner
                  heading={banner.heading}
                  description={banner.description}
                  imageSet={banner.imageSet}
                  imageAlt={banner.imageAlt}
                  icon={featureIconMap[banner.iconName]}
                  ctaText={banner.ctaText}
                  ctaHref={banner.ctaHref}
                  variant={banner.variant}
                />
              </Col>
            );
          })}
          <Col sm={12}>
            {/* ── CTA ── */}
            <div className={styles.ctaSection} aria-label="Get started">
              <div className={styles.ctaInner}>
                <Sparkles size={48} className={styles.ctaIcon} aria-hidden="true" />
                <h2 className={styles.ctaHeading}>
                  Ready for a calmer
                  <br />
                  cooking experience?
                </h2>
                <p className={styles.ctaDescription}>
                  Join thousands of intentional cooks who use Easy Meal to bring calm and
                  inspiration to their kitchens every day.
                </p>
                <div className={styles.ctaButtons}>
                  <Link href="/get-started" className={styles.ctaPrimary}>
                    Get Started Free
                  </Link>
                  <Link href="/meals" className={styles.ctaSecondary}>
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
}
