import { UserManager } from './admin-user';
import { ConstructionContractManager } from './contract';
import { Product } from './products';

// ----------------------------------------------------------------------
export type WarrantyManager = {
  warrantyId: string;
  manufacturer: string;
  feature: string;
  description: string;
  contractId: string;
  status: boolean;
  accountId: string;
  dateTime: string;
  account: UserManager;
  contract: ConstructionContractManager;
  productWarrantyReport: ProductWarrantyReport[];
};

export type ProductWarrantyReport = {
  productId: string;
  warrantyId: string;
  amountofDamageProduct: boolean;
  status: boolean;
  doWarranty: string;
  product: Product;
};
