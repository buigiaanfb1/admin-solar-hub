import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import lockFill from '@iconify/icons-eva/lock-fill';
import unlockFill from '@iconify/icons-eva/unlock-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

type UserMoreMenuProps = {
  onBlock?: VoidFunction;
  onUnblock?: VoidFunction;
  status: boolean;
  accountId: string;
};

export default function UserMoreMenu({ onBlock, onUnblock, status, accountId }: UserMoreMenuProps) {
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
            <ListItemText primary="Khoá tài khoản" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ) : (
          <MenuItem onClick={onUnblock} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={unlockFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Mở khoá tài khoản"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        )}

        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.user.root}/${accountId}/edit`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Chỉnh sửa thông tin"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
