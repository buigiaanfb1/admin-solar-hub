import { ConstructionContractManager } from './contract';
import { Image } from './product';

// ----------------------------------------------------------------------
export type ProcessManager = {
  processId: string;
  title: string;
  description: string;
  status: boolean;
  startDate: string;
  endDate: string;
  createAt: string;
  contractId: string;
  contract: ConstructionContractManager;
  image: Image[];
  isNew?: boolean;
};
