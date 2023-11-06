import { useState } from 'react';
import ProductPackage from 'components/_dashboard/product-package/components/ProductPackage';

// material
import {
  Box,
  Button,
  Dialog,
  Select,
  Switch,
  MenuItem,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  FormControlLabel,
  DialogContentText,
  DialogProps
} from '@material-ui/core';
import OwnerRequestList from './OwnerRequestList';
import { ConstructionContractManager } from '../../@types/contract';

// ----------------------------------------------------------------------

export default function DialogViewContractManagement({
  contract,
  open,
  onClose
}: {
  open: boolean;
  onClose: VoidFunction;
  contract: ConstructionContractManager;
}) {
  return (
    <>
      <Dialog open={open} maxWidth="xl" onClose={onClose} fullWidth>
        <DialogTitle>
          {/* Thêm nhân viên A vào để kháo sát những yêu cầu sau, tối da 1 nhân viên 3 yêu cầu */}
        </DialogTitle>
        <DialogContent>
          <br />
          <ProductPackage
            promotion={{ promotionId: contract.package.promotionId, amount: 1 }}
            onSetProductList={(e: any) => {}}
            currentPackage={contract.package}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained">Chấp thuận</Button>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
