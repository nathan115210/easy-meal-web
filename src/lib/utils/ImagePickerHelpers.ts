import React, { type Dispatch } from 'react';

export const previewImageDispatch = (file: File | undefined | null, previewSetter: Dispatch<React.SetStateAction<string | null>>) => {
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = () => previewSetter(fileReader.result as string);
    fileReader.readAsDataURL(file);
  } else {
    previewSetter(null);
  }
};
export const handleDrop = (event: React.DragEvent<HTMLDivElement>, previewSetter: Dispatch<React.SetStateAction<string | null>>) => {
  event.preventDefault();
  const file = event.dataTransfer.files?.[0] || null;
  previewImageDispatch(file, previewSetter);
};
