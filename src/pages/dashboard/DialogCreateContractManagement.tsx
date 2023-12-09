import { useState } from 'react';
import ProductPackage from 'components/_dashboard/product-package/components/ProductPackage';

// material
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogProps
} from '@material-ui/core';
import { RequestStaff } from '../../@types/request';

// ----------------------------------------------------------------------

export default function DialogCreateContractManagement({
  staffId,
  request
}: {
  staffId: string;
  request: RequestStaff;
}) {
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xl');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMaxWidth(event.target.value as DialogProps['maxWidth']);
  };

  const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullWidth(event.target.checked);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Tạo hợp đồng
      </Button>

      <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} fullWidth={fullWidth}>
        <DialogTitle>
          {/* Thêm nhân viên A vào để kháo sát những yêu cầu sau, tối da 1 nhân viên 3 yêu cầu */}
        </DialogTitle>
        <DialogContent>
          <br />
          <ProductPackage
            promotion={{ promotionId: request.package.promotionId, amount: 1 }}
            onSetProductList={(e: any) => {}}
            currentPackage={request.package}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Tạo hợp đồng
          </Button>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
