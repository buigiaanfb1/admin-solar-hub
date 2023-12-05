import { sum, map } from 'lodash';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Card, Button, CardHeader, Typography } from '@material-ui/core';
// @types
import { ProductState } from '../../../@types/products';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import {
  deleteCart,
  onNextStep,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity
} from '../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Scrollbar from '../../Scrollbar';
import EmptyContent from '../../EmptyContent';
// import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';
import { ProductManager, Image } from '../../../@types/product';
import { PackageManager } from '../../../@types/package';

// ----------------------------------------------------------------------

export type AvailableProductsProps = {
  productId: string;
  name: string;
  manufacturer: string;
  image: Image[] | undefined;
  productWarrantyReport: {
    damages: {
      amountofDamageProduct: number;
      doWanrranty: string;
    };
  };
};

export default function ProductPackage({
  onSetProductList,
  currentPackage
}: {
  onSetProductList: (productList: AvailableProductsProps[]) => void;
  currentPackage: Partial<PackageManager>;
}) {
  const [products, setProducts] = useState<AvailableProductsProps[]>([]);

  useEffect(() => {
    if (currentPackage.packageProduct && currentPackage.packageProduct.length > 0) {
      const activeProducts = currentPackage.packageProduct.map((product) => ({
        productId: product.product.productId,
        name: product.product.name,
        manufacturer: product.product.manufacturer,
        image: product.product.image,
        productWarrantyReport: {
          damages: { amountofDamageProduct: 0, doWanrranty: '' }
        }
      }));
      setProducts(activeProducts);
    }
  }, [currentPackage]);

  const handleDamagePercentage = (productId: string, amountofDamageProduct: number) => {
    const updateProducts = map(products, (product) => {
      if (product.productId === productId) {
        return {
          ...product,
          productWarrantyReport: {
            damages: {
              doWanrranty: product.productWarrantyReport.damages.doWanrranty,
              amountofDamageProduct
            }
          }
        };
      }
      return product;
    });
    setProducts(updateProducts);

    onSetProductList(
      updateProducts.filter(
        (product) =>
          product.productWarrantyReport.damages.doWanrranty ||
          product.productWarrantyReport.damages.amountofDamageProduct > 0
      )
    );
  };

  const handleDoWanrranty = (productId: string, doWanrranty: string) => {
    const updateProducts = map(products, (product) => {
      if (product.productId === productId) {
        return {
          ...product,
          productWarrantyReport: {
            damages: {
              doWanrranty,
              amountofDamageProduct: product.productWarrantyReport.damages.amountofDamageProduct
            }
          }
        };
      }
      return product;
    });
    setProducts(updateProducts);

    onSetProductList(
      updateProducts.filter(
        (product) =>
          product.productWarrantyReport.damages.doWanrranty ||
          product.productWarrantyReport.damages.amountofDamageProduct > 0
      )
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Sản phẩm
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({currentPackage.packageProduct?.length})
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />
          <Scrollbar>
            <CheckoutProductList
              products={products}
              onDamagePercentage={handleDamagePercentage}
              onDoWarranty={handleDoWanrranty}
            />
          </Scrollbar>
        </Card>
      </Grid>
    </Grid>
  );
}
