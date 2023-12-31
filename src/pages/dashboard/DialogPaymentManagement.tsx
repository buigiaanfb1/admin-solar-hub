// material
import { parse, format } from 'date-fns';
import { Grid, Dialog, DialogContent, Paper, Stack, Typography } from '@material-ui/core';
import { fDateTime } from 'utils/formatTime';
// @types
//

import { PaymentManager } from '../../@types/admin-payment';
import { handleRenderLabel } from './PaymentManagement';

// ----------------------------------------------------------------------

type DialogPaymentManagementProps = {
  payment: PaymentManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogPaymentManagement({
  open,
  onClose,
  payment
}: DialogPaymentManagementProps) {
  const formatT = (payDateVnpay: string) => {
    let formattedDate;
    try {
      formattedDate = format(
        parse(payDateVnpay, 'yyyyMMddHHmmss', new Date()),
        "MMM dd, yyyy 'at' HH:mm:ss"
      );
    } catch (error) {
      formattedDate = fDateTime(payDateVnpay);
    }

    return formattedDate;
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogContent>
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Thông tin thanh toán
          </Typography>
          <Paper
            key={payment.paymentId}
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Mã thanh toán: &nbsp;
                  </Typography>
                  {payment.paymentId}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Mã hợp đồng: &nbsp;
                  </Typography>
                  {payment.constructionContractId}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Tổng giá trị: &nbsp;
                  </Typography>
                  {payment.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Tên khách hàng: &nbsp;
                  </Typography>
                  {payment.account.lastname} {payment.account.firstname}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Địa chỉ: &nbsp;
                  </Typography>
                  {payment.account.address}
                </Typography>
                {!(
                  (payment.isDeposit && payment.status === 'Paid') ||
                  (!payment.isDeposit && payment.status === 'Paid')
                ) && (
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Thời gian thanh toán: &nbsp;
                    </Typography>
                    {formatT(payment.payDateVnpay)}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Trạng thái: &nbsp;
                  </Typography>
                  {handleRenderLabel(payment)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
