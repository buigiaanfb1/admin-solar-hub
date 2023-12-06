import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Label } from '@material-ui/icons';
import payment from 'redux/slices/admin/payment';
import { fDateTime } from 'utils/formatTime';

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
  FormControlLabel,
  Paper,
  Stack,
  Typography
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
  console.log(team);
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogContent>
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Thông tin nhóm
          </Typography>
          <Paper
            key={team.staffLead.accountId}
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12} md={12}>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Nhóm trưởng: &nbsp;
                  </Typography>
                  {team.staffLead.lastname} {team.staffLead.firstname}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Tên tài khoản: &nbsp;
                  </Typography>
                  {team.staffLead.username}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Số điện thoại: &nbsp;
                  </Typography>
                  {team.staffLead.phone}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Thành viên
          </Typography>
          {team.staff.map((staff) => (
            <Paper
              key={staff.accountId}
              sx={{
                p: 3,
                width: 1,
                bgcolor: 'background.neutral',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Grid container spacing={5}>
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Tên nhân viên: &nbsp;
                    </Typography>
                    {staff.lastname} {staff.firstname}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Tên tài khoản: &nbsp;
                    </Typography>
                    {staff.username}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Số điện thoại: &nbsp;
                    </Typography>
                    {staff.phone}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
