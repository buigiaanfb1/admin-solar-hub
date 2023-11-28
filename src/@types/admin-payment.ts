import { UserManager } from './admin-user';
import { ConstructionContractManager } from './contract';
import { PackageManager } from './package';
import { ProductManager } from './product';
import { PromotionManager } from './promotion';

// ----------------------------------------------------------------------
export type PaymentManager = {
  paymentId: string;
  amount: number;
  constructionContractId: string;
  status: string;
  taxVnpay: string;
  payDateVnpay: string;
  payDate: string;
  createAt: string;
  isDeposit: boolean;
  accountId: string;
  account: UserManager;
  constructionContract: ConstructionContractManager;
};
