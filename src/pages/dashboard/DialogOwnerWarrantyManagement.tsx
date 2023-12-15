// material
import { Grid, Dialog, DialogContent, Paper, Stack, Typography } from '@material-ui/core';
import AdminContractNewForm from 'components/_dashboard/warranty/WarrantyNewForm';
import { fDateTime } from 'utils/formatTime';
// @types
//
import { WarrantyManager } from '../../@types/warranty';
// ----------------------------------------------------------------------

type DialogOwnerWarrantyManagementProps = {
  warranty: WarrantyManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogOwnerWarrantyManagement({
  open,
  onClose,
  warranty
}: DialogOwnerWarrantyManagementProps) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogContent>
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Thông tin bảo hành
          </Typography>
          <Paper
            key={warranty.warrantyId}
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
                    Tên khách hàng: &nbsp;
                  </Typography>
                  {warranty.account.firstname} {warranty.account.lastname}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Tên tài khoản khách hàng: &nbsp;
                  </Typography>
                  {warranty.account.username}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Ngày tạo: &nbsp;
                  </Typography>
                  {fDateTime(warranty.dateTime)}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Ghi chú: &nbsp;
                  </Typography>
                  {warranty.description}
                </Typography>
                <br />
              </Grid>
            </Grid>
            <AdminContractNewForm currentWarranty={warranty} isEdit={false} isDisabled />
          </Paper>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
