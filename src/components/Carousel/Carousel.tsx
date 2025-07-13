'use client';

import {useEffect, useRef, useState} from 'react';
import CarouselItem, {CarouselItemProps} from './CarouselItem';
import styles from './carousel.module.scss';

const Carousel = ({items}: { items: CarouselItemProps[] }) => {
    const [current, setCurrent] = useState<number>(0);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const itemsLength = items.length;


    const next = () =>
        setCurrent((prev) => (prev + 1) % itemsLength);

    const prev = () =>
        setCurrent((prev) =>
            prev === 0 ? itemsLength - 1 : prev - 1
        );

    // reset and start timer
    const resetTimer = () => {
        if (timer.current) clearInterval(timer.current);
        timer.current = setInterval(() => {
            next();
        }, 5000);
    };

    useEffect(() => {
        resetTimer();
        return () => {
            if (timer.current) clearInterval(timer.current);
        };
    }, []); // run once on mount

    // whenever current changes by manual click, reset the timer
    useEffect(() => {
        resetTimer();

    }, [current]);

    const handleMouseEnter = () => {
        if (timer.current) clearInterval(timer.current);
    }

    const handleMouseLeave = () => {
        resetTimer();
    }

    return (
        <div className={styles.carousel}>
            {itemsLength > 1 && <button
                className={styles['carousel__navigation'] + ' ' + styles['carousel__navigation--prev']}
                onClick={prev}
                disabled={current === 0}
                aria-label="Previous"
            >
                &#8592;
            </button>}
            {itemsLength > 1 && <button
                className={styles['carousel__navigation'] + ' ' + styles['carousel__navigation--next']}
                onClick={next}
                disabled={current === items.length - 1}
                aria-label="Next"
            >
                &#8594;
            </button>}
            <div className={styles['carousel__list']} style={{
                transform: `translateX(-${current * 100}%)`,
            }} onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>

                {items.map((item, index) => (
                    <CarouselItem key={index} {...item} />
                ))}
            </div>
        </div>


    );
}

export default Carousel;