import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import lockFill from '@iconify/icons-eva/lock-fill';
import unlockFill from '@iconify/icons-eva/unlock-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// routes

// ----------------------------------------------------------------------

type UserMoreMenuProps = {
  onBlock?: VoidFunction;
  onUnblock?: VoidFunction;
  status?: boolean;
  id: string;
  textFirstItem?: string;
  textFirstItemAfter?: string;
  textSecondItem?: string;
  path?: string;
  noSecondOption?: boolean;
};

export default function UserMoreMenu({
  onBlock,
  onUnblock,
  status,
  id,
  textFirstItem = 'Khoá tài khoản',
  textSecondItem = 'Chỉnh sửa thông tin',
  textFirstItemAfter = 'Mở khoá tài khoản',
  path = 'dashboard/user',
  noSecondOption = false
}: UserMoreMenuProps) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {status ? (
          <MenuItem onClick={onBlock} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={lockFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={textFirstItem} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ) : (
          <MenuItem onClick={onUnblock} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={unlockFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary={textFirstItemAfter}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        )}
        {!noSecondOption && (
          <MenuItem
            component={RouterLink}
            to={`${path}/${id}/edit`}
            sx={{ color: 'text.secondary' }}
          >
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={textSecondItem} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
