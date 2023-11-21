import { ConstructionContractManager } from './contract';

// ----------------------------------------------------------------------
export type AcceptanceManager = {
  acceptanceId: string;
  status: boolean;
  rating: number;
  feedback: string;
  constructionContractId: string;
  imageFile: string;
  constructionContract: ConstructionContractManager;
};
