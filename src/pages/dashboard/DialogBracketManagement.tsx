// material
import { Dialog, DialogTitle } from '@material-ui/core';
// @types
import AdminBracketNewForm from 'components/_dashboard/bracket/AdminBracketNewForm';
//
import { BracketManager } from '../../@types/bracket';

// ----------------------------------------------------------------------

type DialogBracketManagementProps = {
  bracket: BracketManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogBracketManagement({
  open,
  onClose,
  bracket
}: DialogBracketManagementProps) {
  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết sản phẩm</DialogTitle>
      <AdminBracketNewForm isEdit={true} currentBracket={bracket} isDisabled />
    </Dialog>
  );
}
