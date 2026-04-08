import styles from './recipeCard.module.scss';
import { Clock, ChefHat, Bookmark } from 'lucide-react';
import ImageWrapper, { ImageSetType } from '@/components/imageWrapper/ImageWrapper';
import Link from 'next/link';

export interface RecipeCardProps {
  title: string;
  imageSet: ImageSetType;
  imageAlt: string;
  time: string;
  difficulty: string;
  category: string;
  href: string;
}

function RecipeCard({
  title,
  imageSet,
  imageAlt,
  time,
  difficulty,
  category,
  href,
}: RecipeCardProps) {
  return (
    <Link href={href} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.imageContainer}>
          <div className={styles.imageFill}>
            <ImageWrapper
              imageSet={imageSet}
              alt={imageAlt}
              sizes="(min-width: 1200px) 33vw, (min-width: 769px) 50vw, 90vw"
            />
          </div>
          <div className={styles.imageOverlay} aria-hidden="true" />
          <button className={styles.bookmarkBtn} type="button" aria-label={`Save ${title}`}>
            <Bookmark size={20} aria-hidden="true" />
          </button>
          <span className={styles.categoryBadge}>{category}</span>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <Clock size={14} aria-hidden="true" />
              {time}
            </span>
            <span className={styles.metaItem}>
              <ChefHat size={14} aria-hidden="true" />
              {difficulty}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default RecipeCard;
