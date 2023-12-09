import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import navigation2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

type UserListToolbarProps = {
  numSelected: number;
  filterName: string;
  placeholder?: string;
  onFilterName: (value: string) => void;
  onAssignRequest?: () => void;
};

export default function UserListToolbar({
  numSelected,
  filterName,
  placeholder = 'Tìm tài khoản...',
  onFilterName,
  onAssignRequest
}: UserListToolbarProps) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          Đã chọn
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={(e) => onFilterName(e.target.value)}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 && (
        <Tooltip title="Xoá khảo sát">
          <IconButton onClick={onAssignRequest}>
            <Icon icon={navigation2Fill} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
