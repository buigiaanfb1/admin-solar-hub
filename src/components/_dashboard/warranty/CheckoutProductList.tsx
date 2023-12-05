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
  TableContainer,
  InputAdornment,
  TextField,
  Switch
} from '@material-ui/core';
// utils
import getColorName from '../../../utils/getColorName';
import { vCurrency } from '../../../utils/formatNumber';
// @types
import { CartItem } from '../../../@types/products';
//
import { MIconButton } from '../../@material-extend';
import { ProductManager } from '../../../@types/product';
import { AvailableProductsProps } from './ProductPackage';

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
  available: number;
  quantity: number;
  onIncrease: VoidFunction;
  onDecrease: VoidFunction;
};

type CheckoutProductListProps = {
  products: AvailableProductsProps[];
  onDamagePercentage: (id: string, amountofDamageProduct: boolean) => void;
  onDoWarranty: (id: string, doWanrranty: string) => void;
};

export default function CheckoutProductList({
  products,
  onDamagePercentage,
  onDoWarranty
}: CheckoutProductListProps) {
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell align="left">Thiệt hại</TableCell>
            <TableCell align="left">Giải pháp bảo hành</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => {
            const { productId, name, image } = product;
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

                <TableCell>
                  {/* <TextField
                    style={{ maxWidth: '80px' }}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>
                    }}
                    onChange={(e: any) => {
                      onDamagePercentage(productId, e.target.value);
                    }}
                  /> */}
                  <Switch
                    defaultChecked={product.productWarrantyReport.damages.amountofDamageProduct}
                    color="error"
                    onChange={(e: any) => {
                      onDamagePercentage(productId, e.target.checked);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    defaultValue={product.productWarrantyReport.damages.doWanrranty}
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={2}
                    placeholder="Cách thức bảo hành (thay mới, sửa chữa,...)"
                    onChange={(e: any) => {
                      onDoWarranty(productId, e.target.value);
                    }}
                  />
                </TableCell>

                {/* <TableCell align="left">
                  <Incrementer
                    quantity={quantity}
                    available={available}
                    onDecrease={() => onDecreaseQuantity(productId)}
                    onIncrease={() => onIncreaseQuantity(productId)}
                  />
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
