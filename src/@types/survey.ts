import { UserManager } from './admin-user';
import { ConstructionContractManager } from './contract';
import { RequestManager } from './request';

export type SurveyManager = {
  surveyId: string;
  description: string;
  note: string;
  staffId: Date;
  kWperMonth: number;
  roofArea: number;
  status: boolean;
  staff: UserManager;
  constructionContract: ConstructionContractManager;
  requestId: string;
  request: RequestManager;
};
