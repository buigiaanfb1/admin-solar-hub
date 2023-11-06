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
import { SurveyManager } from '../../../@types/survey';
// import { roles, genders, loginTypes } from './roles';

// ----------------------------------------------------------------------

type SurveyNewFormProps = {
  isEdit: boolean;
  currentSurvey?: SurveyManager;
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

export default function SurveyNewForm({
  isEdit = false,
  currentSurvey,
  isDisabled = false
}: SurveyNewFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState<(File | string)[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewSurveySchema = Yup.object().shape({
    surveyId: Yup.string(),
    note: Yup.string().required('Ghi chú về khảo sát'),
    description: Yup.string().required('Mô tả chi tiết là bắt buộc')
  });

  const handleGetFile = (files: (File | string)[]) => {
    setFiles(files);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      surveyId: currentSurvey?.surveyId || 'default',
      note: currentSurvey?.note || '',
      description: currentSurvey?.description || '',
      status: currentSurvey?.status || '',
      staffId: currentSurvey?.staffId || ''
    },
    validationSchema: NewSurveySchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          await axios.put('api/Survey/Update-survey-by-id', {
            surveyId: values?.surveyId,
            note: values?.note,
            description: values?.description,
            status: currentSurvey?.status,
            staffId: currentSurvey?.staffId
          });
        } else {
          await axios.post('api/Survey/Insert-survey', {
            note: values?.note,
            description: values?.description,
            staffId: user?.userInfo.accountId
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo khảo sát thành công' : 'Cập nhật khảo sát thành công', {
          variant: 'success'
        });
        navigate(PATH_DASHBOARD.survey.list);
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
                    disabled={isDisabled}
                    label="Ghi chú"
                    {...getFieldProps('note')}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={isDisabled}
                    label="Mô tả"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>
                {!isDisabled && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Tạo khảo sát' : 'Cập nhật'}
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
