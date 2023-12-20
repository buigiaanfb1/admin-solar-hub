import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack, TextField, InputAdornment } from '@material-ui/core';
import axios from 'utils/axiosIntegrated';
import { PATH_DASHBOARD } from 'routes/paths';
import { PromotionManager } from '../../../@types/promotion';
// import { roles, genders, loginTypes } from './roles';

// ----------------------------------------------------------------------

type PromotionNewFormProps = {
  isEdit: boolean;
  currentPromotion?: PromotionManager;
};

export default function UserNewForm({ isEdit = false, currentPromotion }: PromotionNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewPromotionSchema = Yup.object().shape({
    promotionId: Yup.string(),
    title: Yup.string().required('Tên khuyến mãi là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    amount: Yup.number().required('Phần trăm là bắt buộc'),
    startDate: Yup.date().required('Ngày bắt đầu là bắt buộc'),
    endDate: Yup.date().required('Ngày kết thúc là bắt buộc')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      promotionId: currentPromotion?.promotionId || 'default',
      title: currentPromotion?.title || '',
      description: currentPromotion?.description || '',
      amount: currentPromotion?.amount || '',
      startDate: currentPromotion?.startDate || '',
      endDate: currentPromotion?.endDate || ''
    },
    validationSchema: NewPromotionSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          await axios.put('api/Promotion/Update-promotion-by-id', {
            promotionId: values?.promotionId,
            title: values?.title,
            description: values?.description,
            amount: values?.amount,
            startDate: new Date(values?.startDate).toDateString(),
            endDate: new Date(values?.endDate).toDateString(),
            status: currentPromotion?.status
          });
        } else {
          await axios.post('api/Promotion/Insert-promotion', {
            promotionId: values?.promotionId,
            title: values?.title,
            description: values?.description,
            amount: values?.amount,
            startDate: new Date(values?.startDate).toDateString(),
            endDate: new Date(values?.endDate).toDateString(),
            status: true
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo khuyến mãi thành công' : 'Cập nhật thành công', {
          variant: 'success'
        });
        navigate(PATH_DASHBOARD.promotion.list);
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Tên khuyến mãi"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                  <TextField
                    fullWidth
                    label="Mô tả"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Phần trăm"
                    {...getFieldProps('amount')}
                    InputProps={{
                      inputProps: { min: 1, max: 10 },
                      endAdornment: <InputAdornment position="start">%</InputAdornment>
                    }}
                    onChange={(e) => {
                      if (e.target.value === '') setFieldValue('amount', e.target.value);

                      if (Number(e.target.value) < 1 || Number(e.target.value) > 100) return;
                      setFieldValue('amount', e.target.value);
                    }}
                    error={Boolean(touched.amount && errors.amount)}
                    helperText={touched.amount && errors.amount}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <DesktopDatePicker
                    label="Ngày bắt đầu"
                    {...getFieldProps('startDate')}
                    onChange={(newValue) => {
                      setFieldValue('startDate', newValue);
                    }}
                    maxDate={values.endDate && new Date(values.endDate)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        error={Boolean(touched.startDate && errors.startDate)}
                        helperText={touched.startDate && errors.startDate}
                      />
                    )}
                  />
                  <DesktopDatePicker
                    label="Ngày kết thúc"
                    {...getFieldProps('endDate')}
                    onChange={(newValue) => {
                      setFieldValue('endDate', newValue);
                    }}
                    minDate={values.startDate && new Date(values.startDate)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        error={Boolean(touched.startDate && errors.startDate)}
                        helperText={touched.startDate && errors.startDate}
                      />
                    )}
                  />
                </Stack>

                {/* 

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    {...getFieldProps('email')}
                    disabled={isEdit && isGoogleProvider}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>

                {showPasswordField && !isGoogleProvider && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      InputProps={{
                        autoComplete: 'new-username'
                      }}
                      fullWidth
                      label="Tên tài khoản"
                      {...getFieldProps('usernameOfUser')}
                      error={Boolean(touched.usernameOfUser && errors.usernameOfUser)}
                      helperText={touched.usernameOfUser && errors.usernameOfUser}
                    />
                  </Stack>
                )}

                {!isEdit && showPasswordField && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Mật khẩu"
                      {...getFieldProps('passwordOfUser')}
                      InputProps={{
                        autoComplete: 'new-password',
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword} edge="end">
                              <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(touched.passwordOfUser && errors.passwordOfUser)}
                      helperText={touched.passwordOfUser && errors.passwordOfUser}
                    />
                  </Stack>
                )}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                  {currentAdmin.role && (
                    <TextField
                      select
                      fullWidth
                      label="Vị trí"
                      placeholder="Vị trí"
                      {...getFieldProps('roleId')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.roleId && errors.roleId)}
                      helperText={touched.roleId && errors.roleId}
                    >
                      {roles[currentAdmin.role].map((option: any) => (
                        <option key={option.code} value={option.code} defaultValue={values.roleId}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  )}
                </Stack> */}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Tạo khuyến mãi' : 'Cập nhật'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
