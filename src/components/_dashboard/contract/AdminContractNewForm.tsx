/* eslint-disable */
import * as Yup from 'yup';
import { forwardRef, useCallback, useEffect, useState } from 'react';
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

import Upload from './Upload';
import { ConstructionContractManager } from '../../../@types/contract';
import CustomerList from '../../../pages/dashboard/ContractCreate/CustomerList';
import PackageList from '../../../pages/dashboard/ContractCreate/PackageList';
import BracketList from '../../../pages/dashboard/ContractCreate/BracketList';

// import { roles, genders, loginTypes } from './roles';

// ----------------------------------------------------------------------

type ProductNewFormProps = {
  isEdit: boolean;
  currentContructionContract?: ConstructionContractManager;
  isDisabled?: boolean;
  staffId?: string;
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
  isDisabled = false,
  staffId
}: ProductNewFormProps) {
  const navigate = useNavigate();
  const { uploadImages, user } = useAuth();
  const [files, setFiles] = useState<(File | string)[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (currentContructionContract?.imageFile) {
      setFiles([currentContructionContract.imageFile]);
    }
  }, [currentContructionContract]);

  const NewProductSchema = Yup.object().shape({
    constructioncontractId: Yup.string(),
    startdate: Yup.date().required('Ngày bắt đầu là bắt buộc'),
    enddate: Yup.date().required('Ngày hoàn thành là bắt buộc'),
    totalcost: Yup.number(),
    isConfirmed: Yup.boolean(),
    imageFile: Yup.string(),
    customerId: Yup.string(),
    staffid: Yup.string(),
    packageId: Yup.string(),
    bracketId: Yup.string(),
    description: Yup.string().nullable()
  });

  const handleGetFile = (file: File | string) => {
    console.log(file);
    setFiles([file]);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      constructioncontractId: currentContructionContract?.constructioncontractId || 'default',
      startdate: currentContructionContract?.startdate || null,
      enddate: currentContructionContract?.enddate || null,
      totalcost: currentContructionContract?.totalcost || 0,
      isConfirmed: currentContructionContract?.isConfirmed || false,
      imageFile: currentContructionContract?.imageFile,
      customerId: currentContructionContract?.customerId,
      staffid: currentContructionContract?.staffid || staffId,
      packageId: currentContructionContract?.packageId,
      bracketId: currentContructionContract?.bracketId,
      description: currentContructionContract?.description
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let imageUrls: { image: string }[] = [];
        console.log(imageUrls);
        if (files.length > 0) {
          imageUrls = await (await uploadImages(files)).map((url) => ({ image: url }));
        }
        if (isEdit) {
          await axios.put('/api/ConstructionContract/Update-construction-contract-with-id', {
            constructioncontractId: values.constructioncontractId,
            startdate: values.startdate,
            enddate: values.enddate,
            imageFile:
              imageUrls[0]?.image ||
              'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
            customerId: values.customerId,
            staffid: staffId,
            packageId: values.packageId,
            bracketId: values.bracketId
          });
        } else {
          await axios.post('api/ConstructionContract/Insert-Construction-contract', {
            startdate: values.startdate,
            enddate: values.enddate,
            totalcost: 0,
            isConfirmed: false,
            imageFile:
              imageUrls[0]?.image ||
              'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
            customerId: values.customerId,
            staffid: staffId,
            packageId: values.packageId,
            bracketId: values.bracketId
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo sản phẩm thành công' : 'Cập nhật sản phẩm thành công', {
          variant: 'success'
        });
        navigate(PATH_DASHBOARD.staffContract.list);
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

  const handleSetValue = (name: string, value: string) => {
    setFieldValue(name, value);
  };
  console.log(errors, values);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack>
                  <Upload onGetFile={handleGetFile} defaultFiles={files[0]} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <DesktopDatePicker
                    label="Ngày bắt đầu"
                    {...getFieldProps('startdate')}
                    onChange={(newValue) => {
                      setFieldValue('startdate', newValue);
                    }}
                    maxDate={values.enddate && new Date(values.enddate)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        error={Boolean(touched.startdate && errors.startdate)}
                        helperText={touched.startdate && errors.startdate}
                      />
                    )}
                  />
                  <DesktopDatePicker
                    label="Ngày kết thúc thi công"
                    {...getFieldProps('enddate')}
                    onChange={(newValue) => {
                      setFieldValue('enddate', newValue);
                    }}
                    minDate={values.startdate && new Date(values.startdate)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        error={Boolean(touched.startdate && errors.startdate)}
                        helperText={touched.startdate && errors.startdate}
                      />
                    )}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom variant="h6">
                    Khách hàng yêu cầu:
                  </Typography>
                  <CustomerList
                    staffId={user?.userInfo.accountId}
                    onSetValue={handleSetValue}
                    selectedValue={values.customerId || ''}
                  />
                </Stack>

                <Stack>
                  <Typography gutterBottom variant="h6">
                    Gói sản phẩm thi công:
                  </Typography>
                  <PackageList
                    staffId={user?.userInfo.accountId}
                    onSetValue={handleSetValue}
                    selectedValue={values.packageId || ''}
                  />
                </Stack>
                <Stack>
                  <Typography gutterBottom variant="h6">
                    Khung đỡ sản phẩm:
                  </Typography>
                  <BracketList
                    staffId={user?.userInfo.accountId}
                    onSetValue={handleSetValue}
                    selectedValue={values.bracketId || ''}
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
