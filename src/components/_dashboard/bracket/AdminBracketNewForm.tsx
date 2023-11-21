/* eslint-disable */
import * as Yup from 'yup';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

// material
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Checkbox,
  Grid,
  Stack,
  TextField,
  FormControlLabel,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axiosIntegrated';
import { PATH_DASHBOARD } from 'routes/paths';
import { AuthUser } from '../../../@types/authentication';
import { BracketManager } from '../../../@types/bracket';
import { Image } from '../../../@types/product';
import Upload from './Upload';
import CarouselBracket from './CarouselBracket';
// import { roles, genders, loginTypes } from './roles';

// ----------------------------------------------------------------------

type BracketNewFormProps = {
  isEdit: boolean;
  currentBracket?: BracketManager;
  isDisabled?: boolean;
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        thousandSeparator
        valueIsNumericString
      />
    );
  }
);

export default function AdminBracketNewForm({
  isEdit = false,
  currentBracket,
  isDisabled = false
}: BracketNewFormProps) {
  const navigate = useNavigate();
  const { uploadImages } = useAuth();
  const [files, setFiles] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (currentBracket?.image && currentBracket?.image.length > 0) {
      setFiles(currentBracket?.image.map((image) => image.imageData));
    }
  }, [currentBracket]);

  const { enqueueSnackbar } = useSnackbar();

  const NewBracketSchema = Yup.object().shape({
    productId: Yup.string(),
    name: Yup.string().required('Tên khung đỡ là bắt buộc'),
    price: Yup.number().required('Giá khung đỡ là bắt buộc'),
    manufacturer: Yup.string().required('Nhà sản xuất là bắt buộc'),
    size: Yup.string().required('Kích thước khung đỡ là bắt buộc'),
    material: Yup.string().required('Chất liệu khung đỡ là bắt buộc')
  });

  const handleGetFile = (files: (File | string)[]) => {
    setFiles(files);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bracketId: currentBracket?.bracketId || 'default',
      name: currentBracket?.name || '',
      price: currentBracket?.price || '',
      manufacturer: currentBracket?.manufacturer || '',
      size: currentBracket?.size || '',
      material: currentBracket?.material || ''
    },
    validationSchema: NewBracketSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let imageUrls: { image: string }[] = [];
        if (files.length > 0) {
          imageUrls = await (await uploadImages(files)).map((url) => ({ image: url }));
        }
        if (isEdit) {
          await axios.put('api/Bracket/Update-bracket-by-id', {
            bracketId: values?.bracketId,
            name: values?.name,
            price: values?.price,
            size: values?.size,
            material: values?.material,
            manufacturer: values?.manufacturer,
            image: imageUrls
          });
        } else {
          await axios.post('api/Bracket/Insert-Bracket', {
            bracketId: values?.bracketId,
            name: values?.name,
            price: values?.price,
            manufacturer: values?.manufacturer,
            size: values?.size,
            material: values?.material,
            status: true,
            image: imageUrls
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo khung đỡ thành công' : 'Cập nhật khung đỡ thành công', {
          variant: 'success'
        });
        navigate(PATH_DASHBOARD.bracket.list);
      } catch (error: any) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    setFieldTouched
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              {isEdit && currentBracket?.image && (
                <Stack spacing={3} sx={{ marginBottom: '1.5em' }}>
                  <CarouselBracket
                    images={
                      currentBracket?.image.length > 0
                        ? currentBracket?.image
                        : ([
                            {
                              imageId: 'default',
                              imageData:
                                'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
                              productId: 'default'
                            }
                          ] as Image[])
                    }
                  />
                </Stack>
              )}
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={isDisabled}
                    label="Tên khung đỡ"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    disabled={isDisabled}
                    label="Nhà sản xuất"
                    {...getFieldProps('manufacturer')}
                    error={Boolean(touched.manufacturer && errors.manufacturer)}
                    helperText={touched.manufacturer && errors.manufacturer}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Giá tiền"
                    disabled={isDisabled}
                    {...getFieldProps('price')}
                    InputProps={{
                      inputProps: { min: 1 },
                      endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                      inputComponent: NumericFormatCustom as any
                    }}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />
                  <TextField
                    fullWidth
                    label="Kích thước"
                    disabled={isDisabled}
                    {...getFieldProps('size')}
                    InputProps={{
                      inputProps: { min: 1 },
                      endAdornment: <InputAdornment position="start">Mét vuông</InputAdornment>,
                      inputComponent: NumericFormatCustom as any
                    }}
                    error={Boolean(touched.size && errors.size)}
                    helperText={touched.size && errors.size}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={isDisabled}
                    label="Chất liệu"
                    {...getFieldProps('material')}
                    error={Boolean(touched.material && errors.material)}
                    helperText={touched.material && errors.material}
                  />
                </Stack>

                <Stack>
                  <Upload onGetFile={handleGetFile} defaultFiles={files} />
                </Stack>

                {!isDisabled && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Thêm khung đỡ' : 'Cập nhật'}
                    </LoadingButton>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </FormikProvider>
  );
}
