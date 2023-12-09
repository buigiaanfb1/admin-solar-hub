// material
import { Dialog, DialogTitle } from '@material-ui/core';
// @types
import AdminProductNewForm from 'components/_dashboard/product/AdminProductNewForm';
//
import { ProductManager } from '../../@types/product';

// ----------------------------------------------------------------------

type DialogProductManagementProps = {
  product: ProductManager;
  open: boolean;
  onClose: VoidFunction;
};

export default function DialogProductManagement({
  open,
  onClose,
  product
}: DialogProductManagementProps) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Chi tiết sản phẩm</DialogTitle>
      <AdminProductNewForm isEdit={true} currentProduct={product} isDisabled />
    </Dialog>
  );
}
