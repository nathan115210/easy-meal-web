import { notFound } from 'next/navigation';
import { getMealBySlug, getAllMealSlugs } from '@/utils/data-server/getMealsData';
import type { Meal } from '@/utils/types/meals';
import styles from './page.module.scss';
import { Col, Grid, Row } from '@/components/grid/Grid';
import { slugify, titleCase } from '@/utils/lib/helpers';
import Chip from '@/components/chip/Chip';
import InfoRow, { InfoRowItem, InfoRowIcon, InfoRowLabel } from '@/components/infoRow/infoRow';
import {
  Bookmark,
  CalendarPlus,
  ChefHat,
  Combine,
  Flame,
  MapIcon,
  ShoppingBasket,
  Timer,
} from 'lucide-react';
import ImageWrapper from '@/components/imageWrapper/ImageWrapper';
import ChipsGroup from '@/components/chip/ChipsGroup';
import Ingredients from '@/app/meals/[slug]/components/ingredients';
import Button from '@/components/button/Button';
import Steps from './components/steps';
import CookModeModal from './components/cookModeModal';

type PageProps = { params: { slug: string } };

export const revalidate = 3600; // ISR: revalidate at most every hour

export async function generateStaticParams() {
  const slugs = await getAllMealSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function MealDetailPage({ params }: PageProps) {
  const { slug } = params;

  const mealData: Meal | undefined = await getMealBySlug(slug);

  if (!mealData) notFound();

  const {
    title,
    cookTime,
    topTags,
    tags,
    difficulty,
    image,
    ingredients,
    description,
    instructions,
    nutritionInfo,
  } = mealData;

  const { calories, carbs, fat, protein } = nutritionInfo || {};
  const hotTag: string | null = topTags?.[0] || tags?.[0] || null;
  const showInfoRow = Boolean(cookTime || difficulty || calories);

  return (
    <Grid data-testid="meal-details-page">
      <Row className={styles.detailsContainer}>
        <Col sm={12} lg={12} xl={6} className={styles['detailsContainer-leftCol']}>
          <div className={styles['detailsContainer-leftCol-image']}>
            <ImageWrapper
              ariaHidden
              alt={`${slugify(title)}-details-page-image`}
              imageSet={{ mobileSrc: image }}
              priority
            />
          </div>
          {/* Steps */}
          <div className={styles.steps}>
            <div className={styles.headingContainer}>
              <h3 className={styles.heading}>
                <MapIcon />
                Steps
              </h3>
              <CookModeModal instructions={instructions} />
            </div>
            <Steps steps={instructions} />
          </div>
        </Col>

        <Col sm={12} lg={12} xl={6} className={styles['detailsContainer-rightCol']}>
          <div className={styles['detailsContainer-rightCol-content']}>
            {hotTag && (
              <Chip
                className={styles.hotTag}
                label={titleCase(hotTag)}
                type="label"
                size="md"
                variant="secondary"
              />
            )}
            {/*  Heading */}
            <h1>{title}</h1>
            {/* Description */}
            <div>{description}</div>
            {/* Tags */}
            {tags && tags.length > 0 && (
              <ChipsGroup>
                {tags
                  .filter((item) => item !== hotTag)
                  .map((item) => (
                    <Chip type="label" variant={'primary'} key={item} label={titleCase(item)} />
                  ))}
              </ChipsGroup>
            )}
            {/*  Info Row Section */}
            {showInfoRow && (
              <InfoRow>
                {cookTime && (
                  <InfoRowItem>
                    <InfoRowIcon icon={<Timer size={16} />} />
                    <InfoRowLabel>{`${cookTime} min`}</InfoRowLabel>
                  </InfoRowItem>
                )}

                {calories && (
                  <InfoRowItem>
                    <InfoRowIcon icon={<Flame size={16} />} />
                    <InfoRowLabel>{`${calories} Kcal`}</InfoRowLabel>
                  </InfoRowItem>
                )}

                {difficulty && (
                  <InfoRowItem>
                    <InfoRowIcon icon={<ChefHat size={16} />} />
                    <InfoRowLabel>{titleCase(difficulty)}</InfoRowLabel>
                  </InfoRowItem>
                )}
              </InfoRow>
            )}

            {/* Nutrition info*/}
            <section className={styles.nutrition}>
              <h3>
                <Combine aria-hidden={true} /> Marcos (Per Serving)
              </h3>
              <ul className={styles['nutrition-list']}>
                {carbs && <li>Carbs: {carbs} g</li>}
                {fat && <li>Fat: {fat} g</li>}
                {protein && <li>Protein: {protein} g</li>}
              </ul>
            </section>

            {/* Actions row */}
            <div className={styles.actions}>
              {/* //TODO */}
              <Button>
                <CalendarPlus size={16} />
                Add to Planner
              </Button>
              {/* //TODO */}
              <Button>
                <ShoppingBasket size={16} />
                One-Click Groceries
              </Button>

              {/* //TODO */}

              <Button variant={'secondary-outline'}>
                <Bookmark size={16} />
                Save
              </Button>
            </div>
            {/*  Ingredients */}
            <Ingredients ingredients={ingredients} mealSlug={slug} />
          </div>
        </Col>
      </Row>
    </Grid>
  );
}
