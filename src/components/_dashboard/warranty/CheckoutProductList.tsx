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
  TableContainer,
  TextField,
  Switch
} from '@material-ui/core';
import { fDate } from 'utils/formatTime';

// utils
// @types
//
import { AvailableProductsProps } from './ProductPackage';
import { isInProgressAndFurther } from '../contract/AdminContractNewForm';

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
  isDisabled?: boolean;
};

export default function CheckoutProductList({
  products,
  onDamagePercentage,
  onDoWarranty,
  isDisabled = false
}: CheckoutProductListProps) {
  console.log(products);
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
                            Hạn bảo hành:&nbsp;
                          </Typography>
                          {product?.warrantyDate ? fDate(product.warrantyDate) : ''}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {product?.warrantyDate
                          ? isInProgressAndFurther(
                              new Date(product.warrantyDate).toDateString()
                            ) && (
                              <Typography component="span" variant="body2" sx={{ color: 'red' }}>
                                (Đã hết hạn bảo hành)
                              </Typography>
                            )
                          : ''}
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
                    disabled={isDisabled}
                    defaultChecked={product.productWarrantyReport.damages.amountofDamageProduct}
                    color="error"
                    onChange={(e: any) => {
                      onDamagePercentage(productId, e.target.checked);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    disabled={isDisabled}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
