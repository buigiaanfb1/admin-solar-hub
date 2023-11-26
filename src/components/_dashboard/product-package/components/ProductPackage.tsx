import { sum, map } from 'lodash';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@material-ui/core';
// @types
import { ProductState } from '../../../../@types/products';
// redux
import { RootState, useDispatch, useSelector } from '../../../../redux/store';
import {
  deleteCart,
  onNextStep,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity
} from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
//
import Scrollbar from '../../../Scrollbar';
import EmptyContent from '../../../EmptyContent';
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';
import { ProductManager, Image } from '../../../../@types/product';
import { PackageManager } from '../../../../@types/package';

// ----------------------------------------------------------------------

export type AvailableProductsProps = {
  productId: string;
  available: number;
  quantity: number;
  manufacturer: string;
  name: string;
  price: number;
  image: Image[] | undefined;
};

export default function ProductPackage({
  promotion,
  onSetProductList,
  currentPackage
}: {
  promotion: { promotionId: string | null; amount: number };
  onSetProductList: (productList: AvailableProductsProps[]) => void;
  currentPackage: Partial<PackageManager>;
}) {
  const { productList } = useSelector((state: RootState) => state.productList);
  const [products, setProducts] = useState<AvailableProductsProps[]>([]);
  const subtotal = sum(
    products.map((productItem: AvailableProductsProps) => productItem.price * productItem.quantity)
  );

  useEffect(() => {
    if (productList && productList.length > 0) {
      const filterDisabledProducts = productList.filter((product) => product.status);
      const activeProducts = filterDisabledProducts.map((product) => ({
        productId: product.productId,
        name: product.name,
        manufacturer: product.manufacturer,
        price: product.price,
        quantity: 0,
        available: 100,
        image: product.image
      }));

      // Merge products from the API into the existing products array
      const mergedProducts = activeProducts.map((activeProduct) => {
        if (currentPackage.packageProduct) {
          const apiProduct = currentPackage.packageProduct.find(
            (apiProduct) => apiProduct.productId === activeProduct.productId
          );

          if (apiProduct) {
            // If there's a matching product in the API, merge it with the existing product
            return { ...activeProduct, ...apiProduct };
          }
        }
        return activeProduct;
      });
      setProducts(mergedProducts);
    }
  }, [productList]);
  // const { cart, total, discount, subtotal } = checkout;
  const isEmptyCart = products.length === 0;

  const handleIncreaseQuantity = (productId: string) => {
    const updateProducts = map(products, (product) => {
      if (product.productId === productId) {
        return {
          ...product,
          quantity: product.quantity + 1
        };
      }
      return product;
    });
    setProducts(updateProducts);

    onSetProductList(updateProducts.filter((product) => product.quantity > 0));
  };

  const handleDecreaseQuantity = (productId: string) => {
    const updateProducts = map(products, (product) => {
      if (product.productId === productId) {
        return {
          ...product,
          quantity: product.quantity - 1
        };
      }
      return product;
    });
    setProducts(updateProducts);

    onSetProductList(updateProducts.filter((product) => product.quantity > 0));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products },
    onSubmit: async (values, { setErrors, setSubmitting }) => {}
  });

  const { values } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6">
                    Sản phẩm
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                      &nbsp;({products.length})
                    </Typography>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              {!isEmptyCart ? (
                <Scrollbar>
                  <CheckoutProductList
                    products={values.products}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                  />
                </Scrollbar>
              ) : (
                <EmptyContent
                  title="Kho sản phẩm rỗng"
                  description="Vui lòng thêm sản phẩm trước khi thêm vào gói sản phẩm."
                  img="/static/illustrations/illustration_empty_cart.svg"
                />
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckoutSummary
              promotionId={promotion.promotionId}
              total={subtotal - (subtotal / 100) * promotion.amount}
              discount={(subtotal / 100) * promotion.amount}
              subtotal={subtotal}
            />
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
