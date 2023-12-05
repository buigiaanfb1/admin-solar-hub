import { UserManager } from './admin-user';

// ----------------------------------------------------------------------
export type TeamManager = {
  staff: UserManager[];
  staffLead: UserManager;
};
