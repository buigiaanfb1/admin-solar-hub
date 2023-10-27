import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment
} from '@material-ui/core';
// utils
import { vCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RowStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

type CheckoutSummaryProps = {
  total: number;
  discount?: number;
  subtotal: number;
  shipping?: number;
  onEdit?: VoidFunction;
  enableEdit?: boolean;
  onApplyDiscount?: (discount: number) => void;
  enableDiscount?: boolean;
};

export default function CheckoutSummary({
  total,
  onEdit,
  discount,
  subtotal,
  shipping,
  onApplyDiscount,
  enableEdit = false,
  enableDiscount = false
}: CheckoutSummaryProps) {
  const displayShipping = shipping !== null ? 'Free' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Thành tiền"
        action={
          enableEdit && (
            <Button
              size="small"
              type="button"
              onClick={onEdit}
              startIcon={<Icon icon={editFill} />}
            >
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Đơn giá
          </Typography>
          <Typography variant="subtitle2">
            {subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
          </Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Giảm
          </Typography>
          <Typography variant="subtitle2">
            {discount ? `${discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ` : '-'}
          </Typography>
        </RowStyle>

        <Divider sx={{ mb: 2 }} />

        <RowStyle>
          <Typography variant="subtitle1">Tổng</Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
              {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
            </Typography>
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              (Đã bao gồm VAT)
            </Typography>
          </Box>
        </RowStyle>
      </CardContent>
    </Card>
  );
}
