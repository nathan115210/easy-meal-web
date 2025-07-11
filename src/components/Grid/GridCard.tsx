import React, {FC} from 'react'
import {GridItemProps} from "@/components/Grid/Grid";
import Image from "next/image";
import './Grid.scss'
import {CtaVariants} from "@/components/Cta/ctaType";
import Cta from "@/components/Cta/Cta";


const GridCard: FC<GridItemProps> = ({id, href, title, imageUrl}) => {
    return (
        <li
            className="grid__card"
        >
            {imageUrl && (
                <div className="grid__card-image">
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={16}
                        height={9}
                        objectFit="cover"
                        layout="responsive"
                    />
                </div>
            )}
            <div className={'grid__card-content'}>

                <h3 className="grid__card-content-title">{title}</h3>

                {href && <Cta href={href} variant={CtaVariants.Secondary}>
                    Learn More
                </Cta>}
            </div>
        </li>
    )
}
export default GridCard
