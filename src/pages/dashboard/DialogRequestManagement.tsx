import { useState } from 'react';
// material
import { Button, Dialog, DialogActions, DialogContent, DialogProps } from '@material-ui/core';
import { useSnackbar } from 'notistack5';

import { updateRequest } from 'redux/slices/admin/request';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';

import OwnerStaffList from './OwnerStaffList';

// ----------------------------------------------------------------------

export default function MaxWidthDialog({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xl');
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAccountId(null);
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (accountId && requestId) {
      try {
        setLoading(true);
        await dispatch(updateRequest({ staffId: accountId, requestId }));
        enqueueSnackbar('Thêm nhân viên vào yêu cầu thành công', { variant: 'success' });
        setLoading(false);
        handleClose();
      } catch (e) {
        enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', { variant: 'error' });
        setLoading(false);
      }
    }
  };

  const handleSelectUser = (accountIdSelected: string) => {
    if (accountId === accountIdSelected) {
      setAccountId(null);
    } else {
      setAccountId(accountIdSelected);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Gán nhân viên
      </Button>

      <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} fullWidth={fullWidth}>
        <DialogContent>
          <OwnerStaffList handleSelectUser={handleSelectUser} />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            onClick={handleSubmit}
            variant="contained"
            disabled={accountId === null}
          >
            Xác nhận
          </LoadingButton>
          <Button onClick={handleClose} variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
