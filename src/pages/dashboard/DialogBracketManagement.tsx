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
import AdminBracketNewForm from 'components/_dashboard/bracket/AdminBracketNewForm';
//
import { BracketManager } from '../../@types/bracket';

// ----------------------------------------------------------------------

type DialogBracketManagementProps = {
  bracket: BracketManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogBracketManagement({
  open,
  onClose,
  bracket
}: DialogBracketManagementProps) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết sản phẩm</DialogTitle>
      <AdminBracketNewForm isEdit={true} currentBracket={bracket} isDisabled />
    </Dialog>
  );
}
