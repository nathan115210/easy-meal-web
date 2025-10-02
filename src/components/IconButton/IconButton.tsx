import Cta, { type CtaProps } from '@/components/Cta/Cta';
import {
  AsteriskIcon,
  CloseIcon,
  HamburgerIcon,
  PenIcon,
  UpDwnArrowIcon,
} from '@/components/Svg/Svg';
import { ReactNode } from 'react';
import styles from './iconButton.module.scss';

export enum IconName {
  hamburger = 'hamburger',
  close = 'close',
  pen = 'pen',
  asterisk = 'asterisk',
  upDownArrow = 'upDownArrow',
}

interface IconButtonProps extends Omit<CtaProps, 'children'> {
  iconName: IconName;
}

const iconMap: Record<IconName, ReactNode> = {
  [IconName.hamburger]: <HamburgerIcon />,
  [IconName.close]: <CloseIcon />,
  [IconName.pen]: <PenIcon />,
  [IconName.asterisk]: <AsteriskIcon />,
  [IconName.upDownArrow]: <UpDwnArrowIcon />,
};

export default function IconButton(props: IconButtonProps) {
  const { iconName, ...rest } = props;
  return (
    <Cta className={styles.iconButton} {...rest}>
      {iconMap[iconName]}
    </Cta>
  );
}
