import React from 'react';
import Cta from '@/components/Cta/Cta';
import {CtaVariants} from '@/components/Cta/ctaType';
import Grid from '../Grid/Grid';
import styles from './introSection.module.scss';
import {featureGridItems, introSectionContent} from '@/constants/homePageData';
import Image from 'next/image';

export default function IntroSection() {
    const {heading, description, features, cta} = introSectionContent;
    return (
        <section className={styles.introSection}>
            <h1 className={styles.introSection__heading}>{heading}</h1>
            <div className={styles.introSection__container}>
                {/*<Carousel items={carouselItems}/>*/}
                <div className={styles.introSection__image}>
                    <Image src={'/intro-image.png'} alt={'Fuel Your Day'} width={300} height={300}/>
                </div>

                <div className={styles.introSection__content}>
                    <p>{description}</p>
                    <ul>
                        {features.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <Cta href={cta.ctaLink} variant={CtaVariants.Primary}>
                        {cta.ctaText}
                    </Cta>
                </div>
            </div>
            <Grid items={featureGridItems} featuredId="planner" heading={'featured'}/>
        </section>
    );
}


