import React, { type Dispatch, useEffect, useRef, useState } from 'react';
import styles from './imagePicker.module.scss';
import Cta from '@/components/Cta/Cta';
import { CtaType } from '@/components/Cta/ctaType';
import ImagePreview from '@/components/ImagePicker/ImagePreview';
import { DragNDropIcon, PlusIcon } from './ImagePickerIcons';

type ImagePickerProps = {
  label: string;
  name: string;
  defaultFile?: File | null;
  draggable?: boolean;
};

// TODO-1: should support upload multiple images
// TODO-4: when multiple images, should display all images in a grid
// TODO-2: should support upload other file types
// TODO-3: Should displaying upload progress
// TODO-5: should support preview image in full page modal
// TODO-6: should support delete image
// TODO-7: should support image cropping before upload
// TODO-8: should support image resizing before upload
// Reference: https://ant.design/components/upload#upload-demo-drag
function ImagePicker({ defaultFile, label, name, draggable }: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    previewImageDispatch(defaultFile, setPreview);
  }, [defaultFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    previewImageDispatch(file, setPreview);
  };

  return (
    <div className={styles.imagePicker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.pickerContainer}>
        <input id={name} ref={inputRef} type="file" accept="image/png, image/jpeg" name={name} onChange={handleFileChange} className={styles.input} />
        {draggable ? (
          <div draggable={draggable} className={styles.dragZone} onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, setPreview)}>
            <span role="img" aria-label="inbox" className="anticon anticon-inbox">
              <DragNDropIcon />
            </span>
            <p>Click or drag file to this area to upload</p>
          </div>
        ) : (
          <Cta type={CtaType.Button} onClick={() => inputRef.current?.click()}>
            <PlusIcon />
            Upload
          </Cta>
        )}
      </div>
      {preview && <ImagePreview previewImageUrl={preview} />}
    </div>
  );
}

export default ImagePicker;

// helper

const previewImageDispatch = (file: File | undefined | null, previewSetter: Dispatch<React.SetStateAction<string | null>>) => {
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = () => previewSetter(fileReader.result as string);
    fileReader.readAsDataURL(file);
  } else {
    previewSetter(null);
  }
};

const handleDrop = (event: React.DragEvent<HTMLDivElement>, previewSetter: Dispatch<React.SetStateAction<string | null>>) => {
  event.preventDefault();
  const file = event.dataTransfer.files?.[0] || null;
  previewImageDispatch(file, previewSetter);
};
