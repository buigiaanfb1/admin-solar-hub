import { useState } from 'react';
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

// ----------------------------------------------------------------------

export default function MaxWidthDialog({ staffId }: { staffId: string }) {
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
        Gán khảo sát
      </Button>

      <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} fullWidth={fullWidth}>
        <DialogTitle>
          Thêm nhân viên A vào để kháo sát những yêu cầu sau, tối da 1 nhân viên 3 yêu cầu
        </DialogTitle>
        <DialogContent>
          <br />
          <OwnerRequestList staffId={staffId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
