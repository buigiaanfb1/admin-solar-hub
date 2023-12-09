// material
import { Dialog, DialogTitle } from '@material-ui/core';
// @types
//

// ----------------------------------------------------------------------

type DialogPackageManagementProps = {
  // package: PackageManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogPackageManagement({
  open,
  onClose
}: // package
DialogPackageManagementProps) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết gói</DialogTitle>
      {/* <AdminProductNewForm isEdit={true} currentProduct={package} isDisabled /> */}
    </Dialog>
  );
}
