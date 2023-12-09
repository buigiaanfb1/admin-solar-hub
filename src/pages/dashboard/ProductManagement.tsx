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
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { fDateTime } from 'utils/formatTime';

import { ProductManager } from '../../@types/product';
import { getProductList, updateProduct } from '../../redux/slices/admin/product';
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
import DialogProductManagement from './DialogProductManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sản phẩm', alignRight: false },
  // { id: 'feature', label: 'Mô tả', alignRight: false },
  { id: 'price', label: 'Giá', alignRight: false },
  { id: 'manufacturer', label: 'Nhà sản xuất', alignRight: false },
  { id: 'warrantyDate', label: 'Bảo hành', alignRight: false },
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
  array: ProductManager[],
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

export default function ProductManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { productList } = useSelector((state: RootState) => state.productList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<ProductManager | null>(null);
  const [orderBy, setOrderBy] = useState('createAt');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  const handleClickOpen = (e: any, product: ProductManager) => {
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
    setSelected(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleBlockProduct = (productId: string) => {
    dispatch(updateProduct({ productId }, false));
  };

  const handleUnBlockProduct = (productId: string) => {
    dispatch(updateProduct({ productId }, true));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productList.length) : 0;

  const filteredUsers = applySortFilter(productList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Danh sách sản phẩm | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách sản phẩm' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.product.newProduct}
              startIcon={<Icon icon={plusFill} />}
            >
              Tạo sản phẩm
            </Button>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            placeholder="Tìm sản phẩm..."
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
                  rowCount={productList.length}
                  numSelected={0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        productId,
                        name,
                        price,
                        manufacturer,
                        feature,
                        warrantyDate,
                        image,
                        status
                      } = row;

                      return (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={productId}
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          onClick={(e: any) => handleClickOpen(e, row)}
                        >
                          <TableCell component="th" scope="row" padding="none" width="100">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/* <TableCell align="left">{feature}</TableCell> */}
                          <TableCell align="left">
                            {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                          </TableCell>
                          <TableCell align="left">{manufacturer}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                (fDateTime(warrantyDate) < fDateTime(new Date()) && 'error') ||
                                'success'
                              }
                            >
                              {sentenceCase(fDateTime(warrantyDate))}
                            </Label>
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
                              onBlock={() => handleBlockProduct(productId)}
                              onUnblock={() => handleUnBlockProduct(productId)}
                              textFirstItem="Tạm ngưng"
                              textFirstItemAfter="Kích hoạt"
                              status={status}
                              id={productId}
                              path={PATH_DASHBOARD.product.root}
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
            count={productList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
        {selected && (
          <DialogProductManagement open={open} onClose={handleClose} product={selected} />
        )}
      </Container>
    </Page>
  );
}
