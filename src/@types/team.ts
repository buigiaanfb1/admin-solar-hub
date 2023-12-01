import { UserManager } from './admin-user';
import { Image } from './product';

// ----------------------------------------------------------------------
export type TeamManager = {
  staffLeadId: string;
  staffId: string;
  createAt: string;
  status: boolean;
  staff: UserManager[];
  staffLead: UserManager;
};
