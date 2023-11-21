import { UserManager } from './admin-user';
import { PackageManager } from './package';
import { SurveyManager } from './survey';

export type RequestManager = {
  requestId: string;
  packageId: string;
  accountId: string;
  createAt: Date;
  status: boolean;
  description: string;
  staffId: string;
  account: UserManager;
  package: PackageManager;
  staff: UserManager;
  survey: SurveyManager[];
};

export type RequestStaff = {
  requestId: string;
  packageId: string;
  accountId: string;
  createAt: Date;
  status: boolean;
  description: string;
  staffId: string;
  account: UserManager;
  package: PackageManager;
  staff: UserManager;
  survey: SurveyManager[];
};
