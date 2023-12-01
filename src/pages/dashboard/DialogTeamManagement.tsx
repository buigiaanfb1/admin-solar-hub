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
import { TeamManager } from '../../@types/team';

// ----------------------------------------------------------------------

type DialogTeamManagementProps = {
  team: TeamManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogTeamManagement({ open, onClose, team }: DialogTeamManagementProps) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết nhóm</DialogTitle>
      {/* <AdminBracketNewForm isEdit={true} currentBracket={bracket} isDisabled /> */}
    </Dialog>
  );
}
