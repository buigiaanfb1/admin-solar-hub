import { useState, useCallback, useEffect } from 'react';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------

interface UploadProps {
  onGetFile: (file: (File | string)[]) => void;
  defaultFiles?: (File | string)[];
}
export default function Upload({ onGetFile, defaultFiles = [] }: UploadProps) {
  const [files, setFiles] = useState<(File | string)[]>(defaultFiles);

  useEffect(() => {
    onGetFile(files);
  }, [files]);

  useEffect(() => {
    if (defaultFiles.length > 0) {
      setFiles(defaultFiles);
    }
  }, [defaultFiles]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setFiles(files);
    },
    [setFiles]
  );

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  return (
    <UploadMultiFile
      accept="image/*"
      showPreview={true}
      files={files}
      onDrop={handleDropMultiFile}
      onRemove={handleRemove}
      onRemoveAll={handleRemoveAll}
    />
  );
}
