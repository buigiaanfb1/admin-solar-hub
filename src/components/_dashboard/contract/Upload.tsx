import { useState, useCallback, useEffect } from 'react';
import UploadSingleFile from './UploadSingleFile';

// ----------------------------------------------------------------------

interface UploadProps {
  onGetFile: (file: File | string) => void;
  defaultFiles?: File | string;
}
export default function Upload({ onGetFile, defaultFiles = '' }: UploadProps) {
  const [file, setFile] = useState<File | string>(defaultFiles);

  useEffect(() => {
    onGetFile(file);
  }, [file]);

  useEffect(() => {
    if (defaultFiles !== null) {
      setFile(defaultFiles);
    }
  }, [defaultFiles]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setFile(files[0]);
    },
    [setFile]
  );

  return <UploadSingleFile accept="image/*" file={file} onDrop={handleDropMultiFile} />;
}
