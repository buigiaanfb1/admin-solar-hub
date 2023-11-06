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
import { ProductManager } from '../../../@types/product';
import Upload from './Upload';
import CarouselProduct from './CarouselProduct';
import { ConstructionContractManager } from '../../../@types/contract';
import { Image } from '../../../@types/product';

// import { roles, genders, loginTypes } from './roles';

// ----------------------------------------------------------------------

type ProductNewFormProps = {
  isEdit: boolean;
  currentContructionContract?: ConstructionContractManager;
  isDisabled?: boolean;
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
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

export default function AdminContractNewForm({
  isEdit = false,
  currentContructionContract,
  isDisabled = false
}: ProductNewFormProps) {
  const navigate = useNavigate();
  const { uploadImages } = useAuth();
  const [files, setFiles] = useState<(File | string)[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (currentContructionContract?.imageFile) {
      setFiles([currentContructionContract.imageFile]);
    }
  }, [currentContructionContract]);

  const NewProductSchema = Yup.object().shape({
    productId: Yup.string(),
    name: Yup.string().required('Tên sản phẩm là bắt buộc'),
    price: Yup.number().required('Giá sản phẩm là bắt buộc'),
    manufacturer: Yup.string().required('Nhà sản xuất là bắt buộc'),
    feature: Yup.string().required('Tính năng là bắt buộc'),
    warrantyDate: Yup.date().required('Ngày hết hạn bảo hành là bắt buộc')
  });

  const handleGetFile = (files: (File | string)[]) => {
    setFiles(files);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // productId: currentProduct?.productId || 'default',
      // name: currentProduct?.name || '',
      // price: currentProduct?.price || '',
      // manufacturer: currentProduct?.manufacturer || '',
      // feature: currentProduct?.feature || '',
      // warrantyDate: currentProduct?.warrantyDate || null
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let imageUrls: { image: string }[] = [];
        if (files.length > 0) {
          imageUrls = await (await uploadImages(files)).map((url) => ({ image: url }));
        }
        // if (isEdit) {
        //   await axios.put('api/Product/update-Product', {
        //     productId: values?.productId,
        //     name: values?.name,
        //     price: values?.price,
        //     manufacturer: values?.manufacturer,
        //     feature: values?.feature,
        //     warrantyDate: values?.warrantyDate,
        //     status: currentProduct?.status,
        //     image: imageUrls
        //   });
        // } else {
        //   await axios.post('api/Product/Insert-Product', {
        //     productId: values?.productId,
        //     name: values?.name,
        //     price: values?.price,
        //     manufacturer: values?.manufacturer,
        //     feature: values?.feature,
        //     warrantyDate: values?.warrantyDate,
        //     status: true,
        //     image: imageUrls
        //   });
        // }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo sản phẩm thành công' : 'Cập nhật sản phẩm thành công', {
          variant: 'success'
        });
        navigate(PATH_DASHBOARD.product.list);
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
              {isEdit && currentContructionContract?.imageFile && (
                <Stack spacing={3} sx={{ marginBottom: '1.5em' }}>
                  <CarouselProduct
                    images={[{ imageData: currentContructionContract?.imageFile } as Image]}
                  />
                </Stack>
              )}
              <Stack spacing={3}>
                <Stack>
                  <Upload onGetFile={handleGetFile} defaultFiles={files} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <DesktopDatePicker
                    label="Ngày bắt đầu"
                    {...getFieldProps('warrantyDate')}
                    disabled={isDisabled}
                    onChange={(newValue) => {
                      setFieldValue('warrantyDate', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        // error={Boolean(touched.warrantyDate && errors.warrantyDate)}
                        // helperText={touched.warrantyDate && errors.warrantyDate}
                      />
                    )}
                  />
                  <DesktopDatePicker
                    label="Ngày hoàn thành"
                    {...getFieldProps('warrantyDate')}
                    disabled={isDisabled}
                    onChange={(newValue) => {
                      setFieldValue('warrantyDate', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        // error={Boolean(touched.warrantyDate && errors.warrantyDate)}
                        // helperText={touched.warrantyDate && errors.warrantyDate}
                      />
                    )}
                  />
                </Stack>

                {!isDisabled && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Tạo họp đồng' : 'Cập nhật'}
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
