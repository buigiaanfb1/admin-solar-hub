import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer
} from '@material-ui/core';
// utils
import getColorName from '../../../../utils/getColorName';
import { vCurrency } from '../../../../utils/formatNumber';
// @types
import { BracketManager } from '../../../../@types/bracket';

//
import { MIconButton } from '../../../@material-extend';
import { ProductManager } from '../../../../@types/product';
import { AvailableProductsProps } from './List';

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

type IncrementerProps = {
  quantity: number;
};

function Incrementer({ quantity }: IncrementerProps) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        {/* <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 0}>
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton> */}
        {quantity}
        {/* <MIconButton
          size="small"
          color="inherit"
          onClick={onIncrease}
          disabled={quantity >= available}
        >
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton> */}
      </IncrementerStyle>
      {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        còn hàng: {available}
      </Typography> */}
    </Box>
  );
}

type CheckoutProductListProps = {
  bracket: BracketManager;
};

export default function CheckoutProductList({ bracket }: CheckoutProductListProps) {
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên khung đỡ</TableCell>
            <TableCell align="left">Giá</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow key={bracket.bracketId}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThumbImgStyle
                  alt="bracket image"
                  src={
                    bracket.image && bracket.image.length > 0
                      ? bracket.image[0].imageData
                      : 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg'
                  }
                />
                <Box>
                  <Typography noWrap variant="subtitle2" sx={{ maxWidth: 200 }}>
                    {bracket.name}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2">
                      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                        Nhà sản xuất:&nbsp;
                      </Typography>
                      {bracket.manufacturer}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </TableCell>

            <TableCell align="left">{vCurrency(bracket.price)} VNĐ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
