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
  const [files, setFiles] = useState<File[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const NewBracketSchema = Yup.object().shape({
    productId: Yup.string(),
    name: Yup.string().required('Tên khung đỡ là bắt buộc'),
    price: Yup.number().required('Giá khung đỡ là bắt buộc'),
    manufacturer: Yup.string().required('Nhà sản xuất là bắt buộc')
  });

  const handleGetFile = (files: File[]) => {
    setFiles(files);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bracketId: currentBracket?.bracketId || 'default',
      name: currentBracket?.name || '',
      price: currentBracket?.price || '',
      manufacturer: currentBracket?.manufacturer || ''
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
            manufacturer: values?.manufacturer
          });
        } else {
          await axios.post('api/Bracket/Insert-Bracket', {
            bracketId: values?.bracketId,
            name: values?.name,
            price: values?.price,
            manufacturer: values?.manufacturer,
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

  console.log(errors);
  console.log(values);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              {isEdit && currentBracket?.image && currentBracket?.image.length > 0 && (
                <Stack spacing={3} sx={{ marginBottom: '1.5em' }}>
                  <CarouselBracket images={currentBracket.image} />
                </Stack>
              )}
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
                </Stack>

                {!isEdit && (
                  <Stack>
                    <Upload onGetFile={handleGetFile} />
                  </Stack>
                )}

                {!isDisabled && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Thêm khung đỡ' : 'Cập nhật'}
                    </LoadingButton>
                  </Box>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
