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
  Container,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { getUserList, deleteUserApi, updateUser } from '../../redux/slices/admin/user';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { UserManager } from '../../@types/admin-user';
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
import DialogRequestManagement from './DialogRequestManagement';
import ListToolbar from './ContractCreate/ListToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '', alignRight: false },
  { id: 'username', label: 'Tên tài khoản', alignRight: false },
  { id: 'fullName', label: 'Họ và tên', alignRight: false },
  { id: 'phone', label: 'Số điện thoại', alignRight: false },
  // { id: 'request', label: 'Yêu cầu khảo sát', alignRight: false },
  { id: 'isFree', label: 'Trạng thái', alignRight: false }
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
  array: UserManager[],
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
    return filter(
      array,
      (_user) => _user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList({
  handleSelectUser
}: {
  handleSelectUser: (accountId: string) => void;
}) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { userList } = useSelector((state: RootState) => state.userList);
  const staffList = userList.filter((user) => user.roleId === '3');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<string>('');
  const [orderBy, setOrderBy] = useState('isFree');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (accountId: string) => {
    handleSelectUser(accountId);
    if (accountId === selected) {
      setSelected('');
      return;
    }
    setSelected(accountId);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - staffList.length) : 0;

  const filteredUsers = applySortFilter(staffList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Danh sách nhân viên | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách nhân viên"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách nhân viên' }
          ]}
        />

        <Card>
          <ListToolbar
            filterName={filterName}
            placeholder="Tìm theo tài khoản..."
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
                  rowCount={staffList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        accountId,
                        username,
                        firstname,
                        lastname,
                        phone,
                        isLeader,
                        isFree,
                        requestStaff
                      } = row;
                      const isItemSelected = selected.indexOf(accountId) !== -1;

                      return (
                        <TableRow
                          hover
                          key={accountId}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          {isFree || isFree === null ? (
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onClick={() => handleClick(accountId)}
                              />
                            </TableCell>
                          ) : (
                            <TableCell padding="checkbox" />
                          )}
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {username}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            {`${firstname} ${lastname}`}
                            {isLeader && (
                              <Label variant="ghost" color="primary" sx={{ ml: 1 }}>
                                {sentenceCase('Leader')}
                              </Label>
                            )}
                          </TableCell>
                          <TableCell align="left">{phone}</TableCell>
                          {/* <TableCell align="left">
                            {isFree || isFree === null ? (
                              <DialogRequestManagement staffId={accountId} />
                            ) : (
                              'Đang trong 3 khảo sát'
                            )}
                          </TableCell> */}
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={isFree || isFree === null ? 'success' : 'warning'}
                            >
                              {sentenceCase(
                                isFree || isFree === null
                                  ? `Available ${
                                      requestStaff.filter((request) => request.status).length
                                    } out of 3`
                                  : 'Unavailable 3 out of 3'
                              )}
                            </Label>
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
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
            count={staffList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
