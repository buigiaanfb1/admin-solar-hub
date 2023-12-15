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

import { BracketManager } from '../../@types/bracket';
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
import DialogBracketManagement from './DialogBracketManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên khung đỡ', alignRight: false },
  { id: 'size', label: 'Kích thước (m2)', alignRight: false },
  { id: 'material', label: 'Chất liệu', alignRight: false },
  { id: 'manufacturer', label: 'Nhà sản xuất', alignRight: false },
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
  array: BracketManager[],
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
      (_bracket) => _bracket.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { bracketList } = useSelector((state: RootState) => state.bracketList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<BracketManager | null>(null);
  const [orderBy, setOrderBy] = useState('createAt');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getBracketList());
  }, [dispatch]);

  const handleClickOpen = (e: any, product: BracketManager) => {
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleBlockProduct = (bracketId: string) => {
    dispatch(updateBracket({ bracketId }, false));
  };

  const handleUnBlockProduct = (bracketId: string) => {
    dispatch(updateBracket({ bracketId }, true));
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bracketList.length) : 0;

  const filteredUsers = applySortFilter(bracketList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Danh sách khung đỡ | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách khung đỡ"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách khung đỡ' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.bracket.newBracket}
              startIcon={<Icon icon={plusFill} />}
            >
              Tạo khung đỡ
            </Button>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            placeholder="Tìm khung đỡ..."
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
                  rowCount={bracketList.length}
                  numSelected={0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { bracketId, name, price, manufacturer, size, material, status } = row;

                      return (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={bracketId}
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
                              <Typography variant="subtitle2">{name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {size?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {material}
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {manufacturer}
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '100px' }}>
                            <Label
                              variant="ghost"
                              color={(status === false && 'error') || 'success'}
                            >
                              {sentenceCase(status ? 'Available' : 'Unavailable')}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <AdminUserMoreMenu
                              onBlock={() => handleBlockProduct(bracketId)}
                              onUnblock={() => handleUnBlockProduct(bracketId)}
                              textFirstItem="Tạm ngưng"
                              textFirstItemAfter="Kích hoạt"
                              status={status}
                              id={bracketId}
                              path={PATH_DASHBOARD.bracket.root}
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
            rowsPerPageOptions={[]}
            component="div"
            count={bracketList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} trong ${count !== -1 ? count : `hơn ${to}`}`
            }
            labelRowsPerPage={<></>}
          />
        </Card>
        {selected && (
          <DialogBracketManagement open={open} onClose={handleClose} bracket={selected} />
        )}
      </Container>
    </Page>
  );
}
