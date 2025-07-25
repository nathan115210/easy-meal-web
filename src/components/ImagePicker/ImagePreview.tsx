import styles from './imagePicker.module.scss';
import Image from 'next/image';
import React from 'react';

interface ImagePreviewProps {
  previewImageUrl: string;
}

export default function ImagePreview({ previewImageUrl }: ImagePreviewProps) {
  return (
    <div className={styles.preview}>
      <Image src={previewImageUrl} alt="Selected image preview" width={200} height={200} />
    </div>
  );
}
