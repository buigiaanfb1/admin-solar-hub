import { UserManager } from './admin-user';
import { PackageManager } from './package';

export type SurveyManager = {
  surveyId: string;
  description: string;
  note: string;
  staffId: Date;
  status: boolean;
  staff: UserManager;
};
