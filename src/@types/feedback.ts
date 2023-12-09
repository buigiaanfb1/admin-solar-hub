import { UserManager } from './admin-user';
import { ConstructionContractManager } from './contract';
import { PackageManager } from './package';

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
  account: UserManager;
  contructionContract: ConstructionContractManager;
  package: PackageManager;
};
