import { MealInstruction } from '@/utils/types/meals';
import styles from './steps.module.scss';
import ImageWrapper from '@/components/imageWrapper/ImageWrapper';
import React from 'react';

export default function Steps({ steps }: { steps: MealInstruction[]; asCookMode?: boolean }) {
  return (
    <ul className={styles.steps}>
      {steps.map((step, index) => {
        const { step: stepNumber, image, text } = step;
        const stepImage = image || '/placeholder.png';
        console.log('stepImage', stepImage);
        return (
          <li className={styles['steps-item']} key={stepNumber ?? index}>
            <div className={styles['steps-item__text']}>
              <div className={styles['steps-item__step-number']}> {stepNumber ?? index + 1}</div>
              {text}
            </div>
            {stepImage && (
              <div className={styles['steps-item__image']}>
                <ImageWrapper
                  ariaHidden
                  alt={`Step ${stepNumber ?? index + 1} image`}
                  imageSet={{ mobileSrc: stepImage }}
                  priority
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
