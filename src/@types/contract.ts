import { AcceptanceManager } from './acceptance';
import { UserManager } from './admin-user';
import { BracketManager } from './bracket';
import { PackageManager } from './package';
import { ProcessManager } from './process';

export type ConstructionContractManager = {
  constructioncontractId: string;
  status: '0' | '1' | '2' | '3' | '4';
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
  acceptance: AcceptanceManager[];
  feedback: any;
  description: string;
  paymentProcess: any[];
  warrantyReport: any[];
  process: ProcessManager[];
};
