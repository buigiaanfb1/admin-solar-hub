import { useState, useCallback, useEffect } from 'react';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Stack,
  Switch,
  Container,
  CardHeader,
  Typography,
  CardContent,
  FormControlLabel
} from '@material-ui/core';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// utils
import { fData } from '../../../utils/formatNumber';
// components
import Page from '../../Page';
import HeaderBreadcrumbs from '../../HeaderBreadcrumbs';
import { UploadAvatar, UploadMultiFile, UploadSingleFile } from '../../upload';

// ----------------------------------------------------------------------

interface UploadProps {
  onGetFile: (file: File[]) => void;
}
export default function Upload({ onGetFile }: UploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    onGetFile(files);
  }, [files]);

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
