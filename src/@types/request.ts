import { UserManager } from './admin-user';
import { PackageManager } from './package';

export type RequestManager = {
  requestId: string;
  packageId: string;
  accountId: string;
  createAt: Date;
  status: string;
  description: string;
  staffId: string;
  account: UserManager;
  package: any;
  staff: any;
};

export type RequestStaff = {
  requestId: string;
  packageId: string;
  accountId: string;
  createAt: Date;
  status: string;
  description: string;
  staffId: string;
  account: UserManager;
  package: PackageManager;
  staff: UserManager;
};
