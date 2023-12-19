/* eslint-disable */
import * as Yup from 'yup';
import { forwardRef, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { parseISO, isAfter } from 'date-fns';

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
import Process from './components/Process';
import Acceptance from './components/Acceptance';

export const isInProgressAndFurther = (startdate: string) => {
  const currentDate = new Date();

  const startDate = parseISO(startdate);

  return isAfter(currentDate, startDate);
};

export const handleRenderProcess = (
  currentContructionContract?: ConstructionContractManager,
  isDisabled: boolean = false
) => {
  if (!currentContructionContract)
    return (
      <Stack>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Loading
        </Typography>
      </Stack>
    );
  if (
    currentContructionContract.status === '2' &&
    !isInProgressAndFurther(currentContructionContract.startdate)
  )
    return (
      <Stack>
        <Typography variant="overline" sx={{ color: 'text.primary' }}>
          Tiến trình
        </Typography>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Để thêm và cập nhật tiến trình cho dự án, vui lòng đợi đến ngày thi công diễn ra để thêm
          và hệ thống sẽ đóng khi thời gian dự án kết thúc hoặc quá trình nghiệm thu bắt đầu.
        </Typography>
      </Stack>
    );

  if (currentContructionContract.process.length === 0 && currentContructionContract.status !== '2')
    return (
      <Stack>
        <Typography variant="overline" sx={{ color: 'text.primary' }}>
          Tiến trình
        </Typography>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Chưa có tiến trình nào. Để thêm tiến trình vui lòng cập nhật thời gian và trạng thái thi
          công.
        </Typography>
      </Stack>
    );
  return (
    <Stack spacing={{ xs: 3, sm: 2 }}>
      <Typography variant="overline" sx={{ color: 'text.primary' }}>
        Tiến trình
      </Typography>
      <Process currentContructionContract={currentContructionContract} isDisabled={isDisabled} />
    </Stack>
  );
};

export const handleRenderAcceptance = (
  currentContructionContract?: ConstructionContractManager,
  isDisabled: boolean = false
) => {
  if (!currentContructionContract)
    return (
      <Stack>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Loading
        </Typography>
      </Stack>
    );

  if (currentContructionContract.process.filter((process) => process.status).length === 0)
    return (
      <Stack>
        <Typography variant="overline" sx={{ color: 'text.primary' }}>
          Nghiệm thu
        </Typography>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Chưa có nghiệm thu nào. Để thêm nghiệm thu vui lòng cập nhật tiến trình thi công phía
          trên.
        </Typography>
      </Stack>
    );
  return (
    <Stack spacing={{ xs: 3, sm: 2 }}>
      <Typography variant="overline" sx={{ color: 'text.primary' }}>
        Nghiệm thu
      </Typography>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        Lưu ý, sau khi cập nhật biên bản nghiệm thu, tiến trình thi công sẽ bị khoá.
      </Typography>
      <Acceptance currentContructionContract={currentContructionContract} isDisabled={isDisabled} />
    </Stack>
  );
};
type ProductNewFormProps = {
  isEdit: boolean;
  currentContructionContract?: ConstructionContractManager;
  isDisabled?: boolean;
  staffId?: string;
  customerId?: string | null;
  surveyId?: string | null;
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
  staffId,
  customerId,
  surveyId
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
    setFiles([file]);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      constructioncontractId: currentContructionContract?.constructioncontractId || 'default',
      startdate: currentContructionContract?.startdate || '',
      enddate: currentContructionContract?.enddate || '',
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
        if (!values.bracketId) {
          enqueueSnackbar('Vui lòng chọn khung đỡ cho hợp đồng', {
            variant: 'warning'
          });
          return;
        }
        if (!values.packageId) {
          enqueueSnackbar('Vui lòng chọn gói cho hợp đồng', {
            variant: 'warning'
          });
          return;
        }
        let imageUrls: { image: string }[] = [];
        if (files.length > 0) {
          imageUrls = await (await uploadImages(files)).map((url) => ({ image: url }));
        }
        if (isEdit) {
          let startdate = values.startdate;
          let enddate = values.enddate;

          if (startdate !== currentContructionContract?.startdate) {
            // Adding one day
            startdate = new Date(values.startdate).toDateString();
          }

          if (enddate !== currentContructionContract?.enddate) {
            // Adding one day
            enddate = new Date(values.enddate).toDateString();
          }

          await axios.put('/api/ConstructionContract/Update-construction-contract-with-id', {
            constructioncontractId: values.constructioncontractId,
            startdate,
            enddate,
            isConfirmed: true,
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
            isConfirmed: true,
            imageFile:
              imageUrls[0]?.image ||
              'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
            customerId: values.customerId,
            staffid: staffId,
            surveyId,
            packageId: values.packageId,
            bracketId: values.bracketId,
            status: '2'
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo hợp đồng thành công' : 'Cập nhật hợp đồng thành công', {
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
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            {isEdit && (
              <>
                {handleRenderProcess(currentContructionContract)}
                {handleRenderAcceptance(currentContructionContract)}
              </>
            )}
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Stack>
                    <Typography variant="overline" sx={{ color: 'text.primary' }}>
                      Hợp đồng
                    </Typography>
                  </Stack>
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
                      minDate={new Date()}
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
                          error={Boolean(touched.enddate && errors.enddate)}
                          helperText={touched.enddate && errors.enddate}
                        />
                      )}
                    />
                  </Stack>
                  <Stack>
                    <div style={{ opacity: 0, maxHeight: '5px' }}>
                      <Typography gutterBottom variant="overline">
                        Khách hàng yêu cầu:
                      </Typography>
                      <CustomerList
                        staffId={user?.userInfo.accountId}
                        onSetValue={handleSetValue}
                        selectedValue={customerId || values.customerId || ''}
                      />
                    </div>
                  </Stack>

                  <Stack>
                    <Typography gutterBottom variant="overline">
                      Gói sản phẩm thi công:
                    </Typography>
                    <PackageList
                      staffId={user?.userInfo.accountId}
                      onSetValue={handleSetValue}
                      selectedValue={values.packageId || ''}
                    />
                  </Stack>
                  <Stack>
                    <Typography gutterBottom variant="overline">
                      Khung đỡ sản phẩm:
                    </Typography>
                    <BracketList
                      staffId={user?.userInfo.accountId}
                      onSetValue={handleSetValue}
                      selectedValue={values.bracketId || ''}
                    />
                  </Stack>
                </Stack>

                {!isDisabled && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Tạo hợp đồng' : 'Cập nhật'}
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
