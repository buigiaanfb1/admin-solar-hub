import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { getTeamList, deleteTeamApi } from 'redux/slices/admin/team';
import { useSnackbar } from 'notistack5';

import { TeamManager } from '../../@types/team';
import { getBracketList, updateBracket } from '../../redux/slices/admin/bracket';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';

import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  UserListHead,
  UserListToolbar,
  AdminUserMoreMenu
} from '../../components/_dashboard/user/list';
import DialogTeamManagement from './DialogTeamManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'staffLeadId', label: 'Mã nhóm', alignRight: false },
  { id: 'staffLeadName', label: 'Tên nhóm trưởng', alignRight: false },
  { id: 'member', label: 'Thành viên', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: TeamManager[],
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_team) => {
      const teamLeader = `${_team.staffLead.lastname} ${_team.staffLead.firstname}`;
      return teamLeader.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { teamList } = useSelector((state: RootState) => state.teamList);
  const teamListAvailable = teamList.filter((team) => team.status);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<TeamManager | null>(null);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getTeamList());
  }, [dispatch]);

  const handleClickOpen = (e: any, team: TeamManager) => {
    const arrayOfTag = [
      '<g fill="currentColor"><circle cx="12" cy="15" r="1"></circle><path d="M17 8h-1V6.11a4 4 0 1 0-8 0V8H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm-7-1.89A2.06 2.06 0 0 1 12 4a2.06 2.06 0 0 1 2 2.11V8h-4zM12 18a3 3 0 1 1 3-3a3 3 0 0 1-3 3z"></path></g>',
      '<g fill="currentColor"><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="19" r="2"></circle></g>',
      'Chỉnh sửa thông tin',
      'Xoá nhóm',
      'Kích hoạt',
      'svg',
      ''
    ];
    if (arrayOfTag.includes(e.target.innerHTML)) return;
    setSelected(team);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleRemoveGroup = async (leaderId: string) => {
    try {
      await dispatch(deleteTeamApi(leaderId));
      enqueueSnackbar('Xoá nhóm thành công', {
        variant: 'success'
      });
    } catch (e) {
      enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
        variant: 'error'
      });
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - teamListAvailable.length) : 0;

  const filteredUsers = applySortFilter(
    teamListAvailable,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Danh sách nhóm | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách nhóm"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách nhóm' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.team.newBracket}
              startIcon={<Icon icon={plusFill} />}
            >
              Tạo nhóm
            </Button>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            placeholder="Tìm nhóm theo tên nhóm trưởng..."
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  isShowCheckbox={false}
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={teamListAvailable.length}
                  numSelected={0}
                  onRequestSort={() => {}}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { staffLeadId, staffLead, status, staff } = row;

                      return (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={staffLeadId}
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          onClick={(e: any) => handleClickOpen(e, row)}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            style={{ maxWidth: '200px' }}
                          >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2">{staffLeadId}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {staffLead.lastname} {staffLead.firstname}
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {staff
                              .map((staff) => `${staff.lastname} ${staff.firstname}`)
                              .join(', ')}
                          </TableCell>
                          <TableCell align="right">
                            <AdminUserMoreMenu
                              onBlock={() => handleRemoveGroup(staffLeadId)}
                              onUnblock={() => {}}
                              textFirstItem="Xoá nhóm"
                              // textFirstItemAfter="Kích hoạt"
                              status={status}
                              id={staffLeadId}
                              path={PATH_DASHBOARD.team.root}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={teamListAvailable.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
        {selected && <DialogTeamManagement open={open} onClose={handleClose} team={selected} />}
      </Container>
    </Page>
  );
}
