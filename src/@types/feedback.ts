import { ProductManager } from './product';
import { PromotionManager } from './promotion';

// ----------------------------------------------------------------------
export type FeedbackManager = {
  feedbackId: string;
  description: string;
  createAt: Date;
  status: boolean;
  contructionContractId: string;
  accountId: string;
  image: string;
  // TODO: TBU
  packageId: string;
  account: any;
  contructionContract: any;
  package: any;
};
