/* eslint-disable */
import * as Yup from 'yup';
import { forwardRef } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

// material
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack, TextField, Typography } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axiosIntegrated';
import { PATH_DASHBOARD } from 'routes/paths';

import Upload from '../contract/Upload';
import { WarrantyManager } from '../../../@types/warranty';
import PackageList from '../../../pages/dashboard/ContractCreate/PackageList';
import ProductPackage from './ProductPackage';

type WarrantyNewFormProps = {
  isEdit: boolean;
  currentWarranty?: WarrantyManager;
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
  currentWarranty,
  isDisabled = false
}: WarrantyNewFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const NewWarrantySchema = Yup.object().shape({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      listProduct: []
    },
    validationSchema: NewWarrantySchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (values.listProduct && values.listProduct.length > 0) {
          await axios.post('/api/WarrantyReport/Insert-product-warranty', {
            warrantyId: currentWarranty?.warrantyId,
            damages: values?.listProduct.map((product: any) => ({
              productId: product.productId,
              doWanrranty: product.productWarrantyReport.damages.doWanrranty,
              amountofDamageProduct: product.productWarrantyReport.damages.amountofDamageProduct
            }))
          });
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Tạo hợp đồng thành công' : 'Cập nhật hợp đồng thành công', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.warranty.list);
        }
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

  const handleSetProductList = (productList: any) => {
    setFieldValue('listProduct', productList);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Stack>
                    <ProductPackage
                      currentPackage={currentWarranty?.contract.package || { packageProduct: [] }}
                      onSetProductList={handleSetProductList}
                      productWarrantyReport={currentWarranty?.productWarrantyReport || []}
                      isDisabled={isDisabled}
                    />
                  </Stack>
                </Stack>

                {!isDisabled && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Cập nhật
                    </LoadingButton>
                  </Box>
                )}
              </Form>
            </FormikProvider>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
