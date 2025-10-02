import React, { useEffect, useRef, useState } from 'react';
import styles from './imagePicker.module.scss';
import Cta from '@/components/Cta/Cta';
import { CtaType } from '@/components/Cta/ctaType';
import ImagePreview from '@/components/ImagePicker/ImagePreview';
import { PlusIcon } from '../Svg/Svg';

type ImagePickerProps = {
  label?: string;
  name: string;
  value?: File | string | null; // Accepts File, URL, or null
  onChange?: (file: File | string | null) => void;
  draggable?: boolean;
  isRequired?: boolean;
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
function ImagePicker({
  value,
  onChange,
  label,
  name,
  draggable = true,
  isRequired = false,
}: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) onChange(file);
    if (isRequired && !file) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  return (
    <div className={styles.imagePicker}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className={styles.pickerContainer}>
        <input
          id={name}
          ref={imageInputRef}
          type="file"
          accept="image/png, image/jpeg"
          name={name}
          onChange={handleFileChange}
          className={styles.input}
          required={isRequired}
        />
        {draggable ? (
          <div
            draggable
            className={styles.dragZone}
            onClick={() => imageInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0] || null;
              if (onChange) onChange(file);
            }}
          >
            {preview ? (
              <ImagePreview previewImageUrl={preview} />
            ) : (
              <div className={styles['dragZone-placeholder']}>
                <span role="img" aria-label="inbox" className="anticon anticon-inbox">
                  <PlusIcon />
                </span>
                <p>Click or drag file to this area to upload</p>
              </div>
            )}
          </div>
        ) : (
          <Cta type={CtaType.Button} onClick={() => imageInputRef.current?.click()}>
            <PlusIcon />
            Upload
          </Cta>
        )}
        {showWarning && (
          <div className={styles.warningText}>Please select an image. This field is required.</div>
        )}
      </div>
    </div>
  );
}

export default ImagePicker;
