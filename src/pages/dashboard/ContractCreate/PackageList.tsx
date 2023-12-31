import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Radio
} from '@material-ui/core';
import { updateRequest } from 'redux/slices/admin/request';
import { useSnackbar } from 'notistack5';
import { getPackageListStaff } from 'redux/slices/admin/package';

// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
// routes
// hooks
import useSettings from '../../../hooks/useSettings';
// @types
import { PackageManager } from '../../../@types/package';
// components
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead } from '../../../components/_dashboard/user/list';
import ListToolbar from './ListToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '', alignRight: false },
  { id: 'name', label: 'Gói sản phẩm', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'price', label: 'Giá', alignRight: false }
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
    return filter(
      array,
      (_pacKage) => _pacKage.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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

  const { packageList } = useSelector((state: RootState) => state.packageList);
  const availablePackageList = packageList.filter((pacKage) => pacKage.status);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string>(selectedValue);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getPackageListStaff());
  }, [dispatch]);

  useEffect(() => {
    onSetValue('packageId', selected);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - availablePackageList.length) : 0;

  const filteredUsers = applySortFilter(
    availablePackageList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Card>
      <ListToolbar
        filterName={filterName}
        placeholder="Tìm theo tên gói..."
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={availablePackageList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={() => {}}
              isShowCheckbox={false}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { packageId, name, description, price } = row;
                  const isItemSelected = selected.indexOf(packageId) !== -1;

                  return (
                    <TableRow
                      hover
                      key={packageId}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Radio checked={isItemSelected} onClick={() => handleClick(packageId)} />
                      </TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="left">{description}</TableCell>
                      <TableCell align="left">{price}</TableCell>
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
        rowsPerPageOptions={[]}
        component="div"
        count={availablePackageList.length}
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
  );
}
