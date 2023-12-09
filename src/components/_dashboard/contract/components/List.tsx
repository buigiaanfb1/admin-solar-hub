import { sum } from 'lodash';
import { useEffect, useState } from 'react';
// material
import { Grid, Card, CardHeader, Typography } from '@material-ui/core';

import Scrollbar from '../../../Scrollbar';
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';
import CheckoutBracketList from './CheckoutBracketList';
import { Image } from '../../../../@types/product';
import { PackageManager } from '../../../../@types/package';
import { BracketManager } from '../../../../@types/bracket';
import { ConstructionContractManager } from '../../../../@types/contract';

// ----------------------------------------------------------------------

export type AvailableProductsProps = {
  productId: string;
  quantity: number;
  manufacturer: string;
  name: string;
  price: number;
  image: Image[] | undefined;
};

export default function ProductPackage({
  promotion,
  currentPackage,
  currentBracket,
  contract
}: {
  promotion: { promotionId: string | null; amount: number };
  currentPackage: PackageManager;
  currentBracket: BracketManager;
  contract: ConstructionContractManager;
}) {
  const [products, setProducts] = useState<AvailableProductsProps[]>([]);
  const subtotal = sum(
    products.map((productItem: AvailableProductsProps) => productItem.price * productItem.quantity)
  );
  useEffect(() => {
    const products = currentPackage.packageProduct.map((product) => ({
      productId: product.productId,
      name: product.product.name,
      manufacturer: product.product.manufacturer,
      price: product.product.price,
      quantity: product.quantity,
      image: product.product.image
    }));
    setProducts(products);
  }, [currentPackage]);

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
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

          <Scrollbar>
            <CheckoutProductList products={products} />
          </Scrollbar>

          <CardHeader
            title={
              <Typography variant="h6">
                Khung đỡ
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          <Scrollbar>
            <CheckoutBracketList bracket={currentBracket} />
          </Scrollbar>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <CheckoutSummary
          promotionId={promotion.promotionId}
          total={contract.totalcost}
          discount={(subtotal / 100) * promotion.amount}
          subtotalPackage={subtotal}
          subtotalBracket={contract.bracket.price}
        />
      </Grid>
    </Grid>
  );
}
