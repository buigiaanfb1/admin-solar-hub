import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
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
import { AuthUser } from '../../../@types/authentication';
import { UserManager } from '../../../@types/admin-user';
// import { roles, genders, loginTypes } from './roles';

// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  currentUser?: UserManager;
  currentAdmin: AuthUser & {
    role?: 'Admin' | 'Owner' | 'Staff';
  };
};

export default function ProductPackageNewForm({
  isEdit = false,
  currentUser,
  currentAdmin
}: UserNewFormProps) {
  console.log(currentUser);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [isSetDefaultPassword, setIsSetDefaultPassword] = useState(false);
  const [isGoogleProvider, setIsGoogleProvider] = useState(currentUser?.isGoogleProvider);
  // manual
  const [showPasswordField, setShowPasswordField] = useState(true);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const NewUserSchema = Yup.object().shape({
    usernameOfUser: Yup.string().required('Tên tài khoản là bắt buộc'),
    email: Yup.string().required('Email là bắt buộc').email(),
    passwordOfUser: Yup.string().required('Mật khẩu là bắt buộc'),
    phone: Yup.string(),
    firstname: Yup.string(),
    lastname: Yup.string(),
    address: Yup.string(),
    roleId: Yup.string(),
    gender: Yup.string(),
    isGoogleProvider: Yup.string()
  });

  const UpdateUserSchema = Yup.object().shape({
    usernameOfUser: Yup.string().required('Tên tài khoản là bắt buộc'),
    email: Yup.string().required('Email là bắt buộc').email(),
    passwordOfUser: Yup.string(),
    phone: Yup.string(),
    firstname: Yup.string(),
    lastname: Yup.string(),
    address: Yup.string(),
    roleId: Yup.string(),
    gender: Yup.string(),
    isGoogleProvider: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      usernameOfUser: currentUser?.username || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      passwordOfUser: currentUser?.password || '',
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      address: currentUser?.address || '',
      roleId: currentUser?.roleId || '4',
      gender: currentUser?.gender ? '0' : '1',
      isGoogleProvider: currentUser?.isGoogleProvider ? 'google' : 'manual'
    },
    validationSchema: isEdit ? UpdateUserSchema : NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          await axios.put('api/Account/update-Account', {
            accountId: currentUser?.accountId,
            status: currentUser?.status,
            firstname: values.firstname,
            lastname: values.lastname,
            address: values.address,
            gender: values.gender === '0' || false,
            ...(isSetDefaultPassword && { password: 'default' }),
            isGoogleProvider: values.isGoogleProvider === 'google' || false
          });
        } else {
          if (values.isGoogleProvider === 'google') {
            await register(values.email, 'default', values.firstname, values.lastname);
          }
          await axios.post('api/Account/register', {
            username:
              values.isGoogleProvider === 'google'
                ? values.usernameOfUser.split('@')[0]
                : values.usernameOfUser,
            email: values.email,
            firstname: values.firstname,
            lastname: values.lastname,
            address: values.address,
            phone: values.phone,
            roleId: values.roleId,
            gender: values.gender === '0' || false,
            password: values.passwordOfUser,
            isGoogleProvider: values.isGoogleProvider === 'google' || false
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo tài khoản thành công' : 'Cập nhật thành công', {
          variant: 'success'
        });
      } catch (error: any) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  console.log(errors);

  useEffect(() => {
    if (values.isGoogleProvider === 'google') {
      setFieldValue('usernameOfUser', values.email);
      setFieldValue('passwordOfUser', 'default');
    }
  }, [values]);

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
                    label="Tên"
                    {...getFieldProps('firstname')}
                    error={Boolean(touched.firstname && errors.firstname)}
                    helperText={touched.firstname && errors.firstname}
                  />
                  <TextField
                    fullWidth
                    label="Họ"
                    {...getFieldProps('lastname')}
                    error={Boolean(touched.lastname && errors.lastname)}
                    helperText={touched.lastname && errors.lastname}
                  />
                </Stack>
                {/* 
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Giới tính"
                    placeholder="Vị trí"
                    {...getFieldProps('gender')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.gender && errors.gender)}
                    helperText={touched.gender && errors.gender}
                  >
                    {genders.map((option: any) => (
                      <option
                        key={option.code}
                        value={option.code}
                        defaultValue={values.gender === '0' ? '0' : '1'}
                      >
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Cách đăng nhập"
                    placeholder="Thủ công, Google..."
                    disabled={isEdit && isGoogleProvider}
                    {...getFieldProps('isGoogleProvider')}
                    onChange={(e) => {
                      e.target.value === 'google'
                        ? setShowPasswordField(false)
                        : setShowPasswordField(true);
                      setFieldValue('isGoogleProvider', e.target.value);
                    }}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.isGoogleProvider && errors.isGoogleProvider)}
                    helperText={touched.isGoogleProvider && errors.isGoogleProvider}
                  >
                    {loginTypes.map((option: any) => (
                      <option
                        key={option.code}
                        value={option.code}
                        defaultValue={values.isGoogleProvider === 'manual' ? 'manual' : 'google'}
                      >
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack> */}

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

                {isEdit && !isGoogleProvider && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <FormControlLabel
                      label="Chuyển về mật khẩu mặc định"
                      control={
                        <Checkbox
                          checked={isSetDefaultPassword}
                          onChange={() => setIsSetDefaultPassword(!isSetDefaultPassword)}
                        />
                      }
                    />
                  </Stack>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Tạo tài khoản' : 'Cập nhật'}
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
