import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import {
  Box,
  Step,
  Paper,
  Button,
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
import Upload from '../Upload';
import { ProcessManager } from '../../../../@types/process';

const NewProcessSchema = Yup.object().shape({
  constructionContractId: Yup.string(),
  imageFile: Yup.string().required('Hình ảnh nghiệm thu là bắt buộc')
});

type ProcessNewFormProps = {
  currentContructionContract: ConstructionContractManager;
  isDisabled?: boolean;
};

export default function Acceptance({
  currentContructionContract,
  isDisabled = false
}: ProcessNewFormProps) {
  const acceptances = currentContructionContract.acceptance.filter(
    (acceptance) => acceptance.status
  );
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      constructionContractId: currentContructionContract?.constructioncontractId,
      imageFile: acceptances[0]?.imageFile
    },
    validationSchema: NewProcessSchema,
    onSubmit: async (values, { setErrors, resetForm, setSubmitting }) => {
      try {
        let imageUrls: { image: string }[] = [];
        if (files.length > 0) {
          imageUrls = await (await uploadImages(files)).map((url) => ({ image: url }));
        }

        if (acceptances[0]?.imageFile) {
          await axios.put('api/Acceptance/Update-acceptance-by-id', {
            acceptanceId: acceptances[0].acceptanceId,
            constructionContractId: values?.constructionContractId,
            imageFile: imageUrls[0].image,
            status: true,
            rating: 5,
            feedback: 'default'
          });
          enqueueSnackbar('Cập nhật nghiệm thu thành công', {
            variant: 'success'
          });
        } else {
          await axios.post('api/Acceptance/Insert-acceptance', {
            constructionContractId: values?.constructionContractId,
            imageFile: imageUrls[0].image,
            status: true,
            rating: 5,
            feedback: 'default'
          });
          enqueueSnackbar('Thêm nghiệm thu thành công', {
            variant: 'success'
          });
        }

        await axios.put('api/ConstructionContract/Update-construction-contract-with-id', {
          constructioncontractId: values?.constructionContractId,
          status: '3'
        });
        setFiles([]);
        resetForm();
        setSubmitting(false);
        dispatch(getContractListByStaff(user?.userInfo.accountId));
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

  const { uploadImages } = useAuth();
  const [files, setFiles] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (acceptances[0]?.imageFile) {
      setFiles([acceptances[0]?.imageFile]);
    }
  }, [currentContructionContract]);

  const handleGetFile = (file: File | string) => {
    setFieldValue('imageFile', file);
    setFiles([file]);
  };

  const handleDeleteAcceptance = async (acceptanceId: string) => {
    try {
      setIsLoading(true);
      await axios.delete('api/Acceptance/Delete-accetance', {
        params: {
          acceptanceId
        }
      });
      dispatch(getContractListByStaff(user?.userInfo.accountId));
      enqueueSnackbar('Xoá nghiệm thu thành công', {
        variant: 'success'
      });

      await axios.put('api/ConstructionContract/Update-construction-contract-with-id', {
        constructioncontractId: values?.constructionContractId,
        status: '2'
      });

      setIsLoading(false);
      setFiles([]);
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
        <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
          <Stack>
            <Upload onGetFile={handleGetFile} defaultFiles={files[0]} />
          </Stack>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            {currentContructionContract.status === '2' && acceptances[0]?.acceptanceId && (
              <LoadingButton
                onClick={() => handleDeleteAcceptance(acceptances[0].acceptanceId)}
                color="error"
                variant="outlined"
                loading={isLoading}
              >
                Xoá
              </LoadingButton>
            )}
            {currentContructionContract.status === '2' ||
              (!isDisabled && (
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!acceptances[0]?.imageFile ? 'Thêm nghiệm thu' : 'Cập nhật'}
                </LoadingButton>
              ))}
          </Box>
        </Paper>
      </Form>
    </FormikProvider>
  );
}
