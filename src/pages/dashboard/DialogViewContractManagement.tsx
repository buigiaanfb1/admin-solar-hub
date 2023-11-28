import * as Yup from 'yup';
import ProductPackage from 'components/_dashboard/contract/components/List';
import ContractInfo from 'components/_dashboard/contract/components/ContractInfo';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@material-ui/lab';

// material
import {
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Stack,
  TextField
} from '@material-ui/core';
import axios from 'utils/axiosIntegrated';
import { useSnackbar } from 'notistack5';
import { LargeItem } from 'components/_dashboard/contract/CarouselContract';
import Timeline from 'components/_dashboard/contract/components/Timeline';
import useAuth from 'hooks/useAuth';
import {
  handleRenderProcess,
  handleRenderAcceptance
} from 'components/_dashboard/contract/AdminContractNewForm';

import { ConstructionContractManager } from '../../@types/contract';

// ----------------------------------------------------------------------

const NewSurveySchema = Yup.object().shape({
  description: Yup.string().required('Góp ý về hợp đồng là bắt buộc')
});

export default function DialogViewContractManagement({
  contract,
  open,
  onClose
}: {
  open: boolean;
  onClose: VoidFunction;
  contract: ConstructionContractManager;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { description: contract.description || '', isRejected: false },
    validationSchema: NewSurveySchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await axios.put('/api/ConstructionContract/Update-construction-contract-with-id', {
          constructioncontractId: contract.constructioncontractId,
          description: values.description,
          status: values.isRejected ? '0' : '2'
        });
        if (values.isRejected) {
          enqueueSnackbar('Đã từ chối hợp đồng thành công', { variant: 'success' });
        } else if (contract.status === '2') {
          enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        } else {
          enqueueSnackbar('Xác nhận hợp đồng thành công', { variant: 'success' });
        }
        onClose();
      } catch (error: any) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <Dialog open={open} maxWidth="xl" onClose={onClose} fullWidth>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogTitle>{/* sd */}</DialogTitle>
          <DialogContent>
            <br />
            <ContractInfo contract={contract} />
            <Stack spacing={3} sx={{ marginBottom: '1.5em', mt: 3 }}>
              {handleRenderProcess(contract)}
              {handleRenderAcceptance(contract)}
            </Stack>
            <Stack spacing={3} sx={{ marginBottom: '1.5em', mt: 3 }}>
              {contract.imageFile && (
                <LargeItem
                  item={{
                    image: contract.imageFile,
                    title: 'image contract',
                    description: 'image contract'
                  }}
                />
              )}
            </Stack>
            <ProductPackage
              promotion={{
                promotionId: contract.package.promotionId,
                amount: Number(contract.package.promotion?.amount)
              }}
              contract={contract}
              currentPackage={contract.package}
              currentBracket={contract.bracket}
            />
            {/* <Card sx={{ p: 3, mb: 6 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <TextField
                  fullWidth
                  label="Ghi chú/ Lý do"
                  multiline
                  disabled={contract.status !== '1'}
                  minRows={4}
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Stack>
            </Card> */}
          </DialogContent>
          <DialogActions>
            {/* {contract.status === '1' && user?.userInfo.roleId === '2' && (
              <>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={() => setFieldValue('isRejected', false)}
                >
                  Chấp thuận
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  loading={isSubmitting}
                  onClick={() => setFieldValue('isRejected', true)}
                >
                  Từ chối
                </LoadingButton>
              </>
            )} */}
            <Button onClick={onClose} variant="text">
              Đóng
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
