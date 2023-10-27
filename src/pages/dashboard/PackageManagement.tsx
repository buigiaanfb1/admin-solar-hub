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
import { fDateTime } from 'utils/formatTime';

import { PackageManager } from '../../@types/package';
import { getPackageList, deletePackageApi, updatePackage } from '../../redux/slices/admin/package';
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
import DialogPackageManagement from './DialogPackageManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Gói sản phẩm', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'price', label: 'Giá', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
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
  array: PackageManager[],
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function PackageManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { packageList } = useSelector((state: RootState) => state.packageList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<PackageManager | null>(null);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getPackageList());
  }, [dispatch]);

  const handleClickOpen = (e: any, pacKage: PackageManager) => {
    const arrayOfTag = [
      '<g fill="currentColor"><circle cx="12" cy="15" r="1"></circle><path d="M17 8h-1V6.11a4 4 0 1 0-8 0V8H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm-7-1.89A2.06 2.06 0 0 1 12 4a2.06 2.06 0 0 1 2 2.11V8h-4zM12 18a3 3 0 1 1 3-3a3 3 0 0 1-3 3z"></path></g>',
      '<g fill="currentColor"><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="19" r="2"></circle></g>',
      'Chỉnh sửa thông tin',
      'Tạm ngưng',
      'Kích hoạt',
      'svg',
      ''
    ];
    if (arrayOfTag.includes(e.target.innerHTML)) return;
    setSelected(pacKage);
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

  const handleBlockPackage = (packageId: string) => {
    dispatch(updatePackage({ packageId }, false));
  };

  const handleUnBlockPackage = (packageId: string) => {
    dispatch(updatePackage({ packageId }, true));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - packageList.length) : 0;

  const filteredUsers = applySortFilter(packageList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Danh sách gói sản phẩm | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách gói sản phẩm"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách gói sản phẩm' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.package.newPackage}
              startIcon={<Icon icon={plusFill} />}
            >
              Tạo gói sản phẩm
            </Button>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            placeholder="Tìm gói sản phẩm..."
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
                  rowCount={packageList.length}
                  numSelected={0}
                  onRequestSort={() => {}}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { packageId, name, price, description, status } = row;

                      return (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={packageId}
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          onClick={(e: any) => handleClickOpen(e, row)}
                        >
                          <TableCell component="th" scope="row" padding="none">
                            <div style={{ width: 100, overflowWrap: 'break-word' }}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div
                              style={{
                                width: 200,
                                overflowWrap: 'break-word',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                display: '-webkit-box'
                              }}
                            >
                              <Typography variant="subtitle2">{description}</Typography>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === false && 'error') || 'success'}
                            >
                              {sentenceCase(status ? 'Available' : 'Unavailable')}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <AdminUserMoreMenu
                              onBlock={() => handleBlockPackage(packageId)}
                              onUnblock={() => handleUnBlockPackage(packageId)}
                              textFirstItem="Tạm ngưng"
                              textFirstItemAfter="Kích hoạt"
                              status={status}
                              id={packageId}
                              path={PATH_DASHBOARD.package.root}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={12} />
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
            count={packageList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
        {selected && <DialogPackageManagement open={open} onClose={handleClose} />}
      </Container>
    </Page>
  );
}
