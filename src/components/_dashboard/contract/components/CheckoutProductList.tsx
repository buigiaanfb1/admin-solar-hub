// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer
} from '@material-ui/core';
// utils
import { vCurrency } from '../../../../utils/formatNumber';
// @types
//
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
  products: AvailableProductsProps[];
};

export default function CheckoutProductList({ products }: CheckoutProductListProps) {
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell align="left">Giá</TableCell>
            <TableCell align="left">Số lượng</TableCell>
            <TableCell align="right">Tổng</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => {
            const { productId, name, price, image, quantity } = product;
            return (
              <TableRow key={productId}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ThumbImgStyle
                      alt="product image"
                      src={
                        image && image.length > 0
                          ? image[0].imageData
                          : 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg'
                      }
                    />
                    <Box>
                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 200 }}>
                        {name}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="body2">
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            Nhà sản xuất:&nbsp;
                          </Typography>
                          {product.manufacturer}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="left">{vCurrency(price)} VNĐ</TableCell>

                <TableCell align="left">
                  <Incrementer quantity={quantity} />
                </TableCell>

                <TableCell align="right">{vCurrency(price * quantity)} VNĐ</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
