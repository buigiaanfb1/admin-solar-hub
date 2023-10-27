import { ProductManager } from './product';
import { PromotionManager } from './promotion';

// ----------------------------------------------------------------------
export type PackageManager = {
  packageId: string;
  name: string;
  description: string;
  price: number;
  promotionId: null | string;
  status: boolean;
  promotion: PromotionManager;
  constructionContract: Array<any>;
  feedback: Array<any>;
  packageProduct: PackageProduct[];
};

export type PackageProduct = {
  productId: string;
  packageId: string;
  status: boolean;
  quantity: number;
  product: ProductManager;
};
