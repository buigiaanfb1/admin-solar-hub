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
import { getRequestList, updateRequest } from 'redux/slices/admin/request';
import { useSnackbar } from 'notistack5';
import { getBracketList } from 'redux/slices/admin/bracket';
import { thumbnailItemsExternal } from 'components/_dashboard/product/CarouselProduct';
import { getUserList, deleteUserApi, updateUser } from '../../../redux/slices/admin/user';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// @types
import { BracketManager } from '../../../@types/bracket';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  UserListHead,
  UserListToolbar,
  AdminUserMoreMenu
} from '../../../components/_dashboard/user/list';
import AlertDialog from '../DialogRequestManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '', alignRight: false },
  { id: 'name', label: 'Tên khung', alignRight: false },
  { id: 'price', label: 'Giá', alignRight: false },
  { id: 'manufacturer', label: 'Thương hiệu', alignRight: false },
  { id: 'image', label: 'Ảnh', alignRight: false }
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

export default function OwnerRequestList({
  staffId,
  onSetValue,
  selectedValue
}: {
  staffId: string;
  onSetValue: (key: string, value: string) => void;
  selectedValue: string;
}) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { bracketList } = useSelector((state: RootState) => state.bracketList);
  const availableBracketList = bracketList.filter((bracket) => bracket.status);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string>(selectedValue);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getBracketList());
  }, [dispatch]);

  useEffect(() => {
    onSetValue('bracketId', selected);
  }, [selected]);

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
    dispatch(updateRequest({ staffId, requestId: selected }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - availableBracketList.length) : 0;

  const filteredUsers = applySortFilter(
    availableBracketList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Card>
      <UserListToolbar
        numSelected={selected.length}
        filterName={filterName}
        placeholder="Tìm theo tên..."
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
              rowCount={availableBracketList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={() => {}}
              isShowCheckbox={false}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { bracketId, name, manufacturer, price, image } = row;
                  const isItemSelected = selected.indexOf(bracketId) !== -1;

                  return (
                    <TableRow
                      hover
                      key={bracketId}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onClick={() => handleClick(bracketId)} />
                      </TableCell>
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
                        {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '150px' }}>
                        {manufacturer}
                      </TableCell>
                      <TableCell align="left">
                        {image &&
                          thumbnailItemsExternal(
                            image.slice(0, image.length > 3 ? 3 : image.length)
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
        count={availableBracketList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage}
      />
    </Card>
  );
}
