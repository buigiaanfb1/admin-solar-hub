import { UserManager } from './admin-user';
import { BracketManager } from './bracket';
import { PackageManager } from './package';

export type ConstructionContractManager = {
  constructioncontractId: string;
  status: boolean;
  startdate: string;
  enddate: string;
  totalcost: number;
  isConfirmed: boolean;
  imageFile: string;
  customerId: string;
  staffid: string;
  packageId: string;
  bracketId: string;
  bracket: BracketManager;
  customer: UserManager;
  package: PackageManager;
  staff: UserManager;
  acceptance: any;
  feedback: any;
  paymentProcess: any[];
  warrantyReport: any[];
};
