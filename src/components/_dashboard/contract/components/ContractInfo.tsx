import { fDate, fDateTime } from 'utils/formatTime';

import { Typography, Stack, Paper, Grid } from '@material-ui/core';
import { handleRenderLabel } from 'pages/dashboard/StaffContractManagement';

import { ConstructionContractManager } from '../../../../@types/contract';

export default function ContractInfo({ contract }: { contract: ConstructionContractManager }) {
  return (
    <Stack spacing={3} alignItems="flex-start">
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        Thông tin hợp đồng
      </Typography>
      <Paper
        key={contract.constructioncontractId}
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
                Số hợp đồng: &nbsp;
              </Typography>
              {contract.constructioncontractId}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Ngày thi công: &nbsp;
              </Typography>
              {fDate(contract.startdate)}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Ngày hoàn thành: &nbsp;
              </Typography>
              {fDate(contract.enddate)}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Người tạo hợp đồng: &nbsp;
              </Typography>
              {contract.staff.lastname + contract.staff.firstname}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Tổng giá trị: &nbsp;
              </Typography>
              {contract.totalcost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Trạng thái: &nbsp;
              </Typography>
              {handleRenderLabel(contract.status, contract.startdate, contract.enddate)}
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
              {contract.customer.lastname + contract.customer.firstname}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Email khách hàng: &nbsp;
              </Typography>
              {contract.customer.email}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                Địa chỉ: &nbsp;
              </Typography>
              {contract.customer.address}
            </Typography>
            {contract?.createAt && (
              <Typography
                variant="body2"
                gutterBottom
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                  Ngày tạo hợp đồng: &nbsp;
                </Typography>
                {fDateTime(contract.createAt)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}
