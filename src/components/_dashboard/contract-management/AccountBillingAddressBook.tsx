// material
// import { Box, Card, Button, Typography, CardProps, Stack, Paper } from '@material-ui/core';
import { Card, Typography, Stack, Paper, Grid } from '@material-ui/core';
// @types
// import { UserAddressBook } from '../../../@types/user';

// ----------------------------------------------------------------------

// interface AccountBillingAddressBookProp extends CardProps {
//   addressBook: UserAddressBook[];
// }

export default function AccountBillingAddressBook() {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Thông tin hợp đồng
        </Typography>

        {[1].map((address, index) => (
          <Paper
            key={index}
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
                    Tên hợp đồng: &nbsp;
                  </Typography>
                  Hợp đồng A
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Số hợp đồng: &nbsp;
                  </Typography>
                  HĐ02589
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Nội dung: &nbsp;
                  </Typography>
                  HĐ02589
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Ngày ký: &nbsp;
                  </Typography>
                  09/12/2022
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Người chịu trách nhiệm: &nbsp;
                  </Typography>
                  Nguyễn Văn B
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Đã thanh toán: &nbsp;
                  </Typography>
                  150.000.000 VNĐ
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Ngày kết thúc: &nbsp;
                  </Typography>
                  02/12/2023
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Tình trạng: &nbsp;
                  </Typography>
                  Đang thực hiện
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Khách hàng: &nbsp;
                  </Typography>
                  Nguyễn Văn A
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Ngày hết hiệu lực: &nbsp;
                  </Typography>
                  06/12/2024
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Giá trị hợp đồng: &nbsp;
                  </Typography>
                  300.000.000 VNĐ
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Còn lại: &nbsp;
                  </Typography>
                  50.000.000 VNĐ
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                    Ngày tái ký: &nbsp;
                  </Typography>
                  04/12/2024
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Card>
  );
}
