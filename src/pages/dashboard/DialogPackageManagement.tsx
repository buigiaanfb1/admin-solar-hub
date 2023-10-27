import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Grid,
  Radio,
  Dialog,
  Button,
  Divider,
  Checkbox,
  TextField,
  RadioGroup,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// @types
import AdminProductNewForm from 'components/_dashboard/product/AdminProductNewForm';
//
import { PackageManager } from '../../@types/package';

// ----------------------------------------------------------------------

type DialogPackageManagementProps = {
  // package: PackageManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogPackageManagement({
  open,
  onClose
}: // package
DialogPackageManagementProps) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết gói</DialogTitle>
      {/* <AdminProductNewForm isEdit={true} currentProduct={package} isDisabled /> */}
    </Dialog>
  );
}
