import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Container,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { fDateTime } from 'utils/formatTime';
import { getRequestList } from 'redux/slices/admin/request';
import { useSnackbar } from 'notistack5';

// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar } from '../../components/_dashboard/user/list';
import { RequestManager } from '../../@types/request';
import DialogRequestManagement from './DialogRequestManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'packageId', label: 'Mã gói', alignRight: false },
  { id: 'username', label: 'Tài khoản khách hàng', alignRight: false },
  { id: 'fullname', label: 'Tên khách hàng', alignRight: false },
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
  array: RequestManager[],
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
    return filter(array, (_request) => {
      const username = `${_request.account.lastname} ${_request.account.firstname}`;
      return username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OwnerRequestList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { requestList } = useSelector((state: RootState) => state.requestList);
  const requestAvailableList = requestList.filter(
    (request) => request.staffId === null && request.status
  );
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<string>('');
  const [orderBy, setOrderBy] = useState('createAt');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getRequestList());
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
    // dispatch(updateRequest({ staffId, requestId: selected }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - requestAvailableList.length) : 0;

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
                      const { requestId, packageId, createAt, account } = row;

                      return (
                        <TableRow hover key={requestId} tabIndex={-1} role="checkbox">
                          <TableCell align="left">{packageId}</TableCell>
                          <TableCell align="left">{account.username}</TableCell>
                          <TableCell align="left">
                            {account.lastname} {account.firstname}
                          </TableCell>
                          <TableCell align="left">{fDateTime(createAt)}</TableCell>
                          <TableCell align="left">
                            <DialogRequestManagement requestId={requestId} />
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
