import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { fDateTime } from 'utils/formatTime';
import { disableRequest, getRequestList } from 'redux/slices/staff/request';
import { useSnackbar } from 'notistack5';
import useAuth from 'hooks/useAuth';

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
import { RequestManager, RequestStaff } from '../../@types/request';
import DialogCreateContractManagement from './DialogCreateContractManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '', alignRight: false },
  { id: 'packageName', label: 'Tên gói', alignRight: false },
  { id: 'username', label: 'Tài khoản khách hàng', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'createAt', label: 'Ngày tạo', alignRight: false },
  { id: 'tools', label: '', alignRight: false }
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
  array: RequestStaff[],
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
      (_request) => _request.account.username.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OwnerRequestList({ staffId }: { staffId: string }) {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { requestList } = useSelector((state: RootState) => state.staffRequestList);
  const requestAvailableList = requestList.filter((request) => request);
  // const requestAvailableList = requestList.filter((request) => request);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string>('');
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getRequestList(user?.userInfo.accountId));
  }, [dispatch]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (requestId: string) => {
    if (requestId === selected) {
      setSelected('');
      return;
    }
    setSelected(requestId);
  };

  const handleAssignRequest = () => {
    dispatch(disableRequest(selected, staffId));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - requestList.length) : 0;

  const filteredUsers = applySortFilter(
    requestAvailableList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Danh sách các yêu cầu mới | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách các yêu cầu mới"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách các yêu cầu mới' }
          ]}
          action={
            // <Button
            //   variant="contained"
            //   component={RouterLink}
            //   to={PATH_DASHBOARD.product.newProduct}
            //   startIcon={<Icon icon={plusFill} />}
            // >
            //   Tạo sản phẩm
            // </Button>
            <></>
          }
        />
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            placeholder="Tìm theo tài khoản khách hàng..."
            onFilterName={handleFilterByName}
            onAssignRequest={handleAssignRequest}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={requestAvailableList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={() => {}}
                  isShowCheckbox={false}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        requestId,
                        package: { name },
                        createAt,
                        account: { username },
                        description,
                        status
                      } = row;
                      const isItemSelected = selected.indexOf(requestId) !== -1;

                      return (
                        <TableRow
                          hover
                          key={requestId}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onClick={() => handleClick(requestId)}
                            />
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{username}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="left">{fDateTime(createAt)}</TableCell>
                          <TableCell align="center" style={{ width: '200px' }}>
                            {status ? (
                              <Button
                                onClick={() => navigate(PATH_DASHBOARD.contract.newContractStaff)}
                                variant="contained"
                              >
                                Tạo hợp đồng
                              </Button>
                            ) : (
                              <Label variant="ghost" color="error">
                                CANCELLED
                              </Label>
                            )}
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
            count={requestAvailableList.length}
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
