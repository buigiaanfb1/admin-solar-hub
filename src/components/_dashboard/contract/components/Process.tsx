import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import {
  Box,
  Step,
  Paper,
  Stepper,
  StepLabel,
  Typography,
  Stack,
  Grid,
  TextField
} from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack5';
import axios from 'utils/axiosIntegrated';
import { getContractListByStaff } from 'redux/slices/admin/contract';
import { useDispatch } from 'react-redux';
import { fDate, fDateDM } from 'utils/formatTime';
import CarouselProduct from 'components/_dashboard/product/CarouselProduct';

import { ConstructionContractManager } from '../../../../@types/contract';
import Upload from './Upload';
import { ProcessManager } from '../../../../@types/process';

const NewProcessSchema = Yup.object().shape({
  contractId: Yup.string(),
  title: Yup.string().required('Tiêu đề là bắt buộc'),
  description: Yup.string().required('Mô tả là bắt buộc'),
  startDate: Yup.date().required('Ngày bắt đầu là bắt buộc'),
  endDate: Yup.date().required('Ngày hoàn thành là bắt buộc')
});

type ProcessNewFormProps = {
  currentContructionContract: ConstructionContractManager;
  isDisabled?: boolean;
};

export default function Process({
  currentContructionContract,
  isDisabled = false
}: ProcessNewFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { uploadImages } = useAuth();
  const [files, setFiles] = useState<(File | string)[]>([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      contractId: currentContructionContract?.constructioncontractId,
      title: '',
      description: '',
      startDate: '',
      endDate: ''
    },
    validationSchema: NewProcessSchema,
    onSubmit: async (values, { setErrors, resetForm, setSubmitting }) => {
      try {
        let imageUrls: { image: string }[] = [];
        if (files.length > 0) {
          imageUrls = await (await uploadImages(files)).map((url) => ({ image: url }));
        }
        await axios.post('api/Process/Insert-process', {
          contractId: values?.contractId,
          title: values?.title,
          description: values?.description,
          startDate: values?.startDate,
          endDate: values?.endDate,
          image: imageUrls
        });

        resetForm();
        setSubmitting(false);
        dispatch(getContractListByStaff(user?.userInfo.accountId));
        enqueueSnackbar('Thêm tiến trình thành công', {
          variant: 'success'
        });
        setFiles([]);
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

  const initialSteps =
    currentContructionContract.status === '2' && !isDisabled
      ? [
          ...currentContructionContract.process.filter((process) => process.status),
          { processId: 'new', title: 'Tiến độ hôm nay', isNew: true } as ProcessManager
        ]
      : [...currentContructionContract.process.filter((process) => process.status)];

  const [steps, setSteps] = useState<ProcessManager[]>(initialSteps);
  const [isLoading, setIsLoading] = useState(false);

  console.log(steps);

  useEffect(() => {
    setSteps(
      currentContructionContract.status === '2' && !isDisabled
        ? [
            ...currentContructionContract.process.filter((process) => process.status),
            { processId: 'new', title: 'Tiến độ hôm nay', isNew: true } as ProcessManager
          ]
        : [...currentContructionContract.process.filter((process) => process.status)]
    );
  }, [currentContructionContract.process]);

  const [activeStep, setActiveStep] = useState<any>(steps.length - 1);

  const [skipped, setSkipped] = useState(new Set<number>());

  const handleGetFile = (files: (File | string)[]) => {
    setFiles(files);
  };

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleDeleteProcess = async (processId: string) => {
    try {
      setIsLoading(true);
      await axios.delete('api/Process/delete-process', {
        params: {
          dto: processId
        }
      });
      dispatch(getContractListByStaff(user?.userInfo.accountId));
      enqueueSnackbar('Xoá tiến trình thành công', {
        variant: 'success'
      });
      setIsLoading(false);
    } catch (error: any) {
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại.', {
        variant: 'error'
      });
      setIsLoading(false);
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((_, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step
                key={steps[index].processId}
                {...stepProps}
                onClick={() => setActiveStep(index)}
              >
                <StepLabel {...labelProps}>
                  <Typography variant="overline" sx={{ color: 'text.primary' }}>
                    {steps[index]?.title}
                  </Typography>
                  {index !== steps.length - 1 && (
                    <Typography
                      variant="overline"
                      sx={{ color: 'text.secondary' }}
                      style={{ display: 'block' }}
                    >
                      {fDateDM(steps[index].startDate)} - {fDateDM(steps[index].endDate)}
                    </Typography>
                  )}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length - 1 && steps[activeStep]?.isNew ? (
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <DesktopDatePicker
                  label="Ngày bắt đầu công đoạn"
                  {...getFieldProps('startDate')}
                  onChange={(newValue) => {
                    setFieldValue('startDate', newValue);
                  }}
                  minDate={new Date(currentContructionContract.startdate)}
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
                  label="Ngày kết thúc công đoạn"
                  {...getFieldProps('endDate')}
                  onChange={(newValue) => {
                    setFieldValue('endDate', newValue);
                  }}
                  disabled={!values.startDate}
                  minDate={values.startDate && new Date(values.startDate)}
                  maxDate={new Date(currentContructionContract.enddate)}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      error={Boolean(touched.endDate && errors.endDate)}
                      helperText={touched.endDate && errors.endDate}
                    />
                  )}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                  fullWidth
                  label="Tiêu đề"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                  fullWidth
                  label="Nội dung"
                  multiline
                  minRows={4}
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Stack>
              <Stack>
                <Upload onGetFile={handleGetFile} defaultFiles={files} />
              </Stack>
              <Box sx={{ display: 'flex', mt: 3 }}>
                <Box sx={{ flexGrow: 1 }} />
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Thêm
                </LoadingButton>
              </Box>
            </Stack>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            {steps.length === 0 ? (
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Chưa có tiến trình nào.
              </Typography>
            ) : (
              <>
                {' '}
                <Grid container spacing={5}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Tiêu đề: &nbsp;
                      </Typography>
                      {steps[activeStep]?.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Ngày cập nhật tiến độ: &nbsp;
                      </Typography>
                      {fDate(steps[activeStep].createAt)}
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Nội dung: &nbsp;
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      {steps[activeStep].description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Ngày thực hiện: &nbsp;
                      </Typography>
                      {fDate(steps[activeStep].startDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Ngày hoàn thành: &nbsp;
                      </Typography>
                      {fDate(steps[activeStep].endDate)}
                    </Typography>
                  </Grid>
                </Grid>
                <Stack spacing={3} sx={{ mt: 1 }}>
                  {steps[activeStep].image.length > 0 && (
                    <Stack>
                      <CarouselProduct images={steps[activeStep].image} />
                    </Stack>
                  )}
                  <Stack>
                    {currentContructionContract.status === '2' && !isDisabled && (
                      <LoadingButton
                        onClick={() => handleDeleteProcess(steps[activeStep].processId)}
                        variant="outlined"
                        color="error"
                        loading={isLoading}
                      >
                        Xoá tiến trình
                      </LoadingButton>
                    )}
                  </Stack>
                </Stack>
              </>
            )}
          </Paper>
        )}
      </Form>
    </FormikProvider>
  );
}
