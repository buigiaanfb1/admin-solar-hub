import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'utils/axiosIntegrated';
import { useSnackbar } from 'notistack5';
import { useDispatch } from 'react-redux';
import { getWarrantyList } from 'redux/slices/admin/warranty';
// material
import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogActions,
  Card,
  Stack
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';

// @types
// import AdminWarrantyNewForm from 'components/_dashboard/bracket/AdminWarrantyNewForm';
//
import ContractList from './Warranty/ContractList';

// ----------------------------------------------------------------------

type DialogWarrantyManagementProps = {
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogWarrantyManagement({ open, onClose }: DialogWarrantyManagementProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const NewWarrantySchema = Yup.object().shape({
    contractId: Yup.string().required('Vui lòng chọn hợp đồng cần bảo hành'),
    feature: Yup.string(),
    description: Yup.string().required('Vui lòng thêm ghi chú cho bảo hành'),
    manufacturer: Yup.string(),
    accountId: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      contractId: '',
      feature: 'feature',
      description: '',
      manufacturer: 'manufacturer',
      accountId: user?.userInfo.accountId,
      image: []
    },
    validationSchema: NewWarrantySchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await axios.post('api/WarrantyReport/Insert-warranty', {
          contractId: values.contractId,
          accountId: values.accountId,
          description: values.description,
          manufacturer: values.manufacturer,
          feature: values.feature
        });
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Tạo bảo hành thành công', {
          variant: 'success'
        });
        dispatch(getWarrantyList());
        onClose();
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
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogTitle>Tạo bảo hành</DialogTitle>
          <Stack spacing={3}>
            <Stack>
              <Stack>
                <ContractList onSetValue={handleSetValue} />
              </Stack>
            </Stack>
            <Stack>
              <Card sx={{ p: 3, mb: 6 }}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  minRows={4}
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Card>
            </Stack>
          </Stack>
          <DialogActions>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              disabled={values.contractId === ''}
              type="submit"
            >
              Xác nhận
            </LoadingButton>
            <Button onClick={onClose} variant="outlined">
              Đóng
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
