import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { fDateTime } from 'utils/formatTime';
import { getWarrantyList, deleteWarrantyApi } from 'redux/slices/admin/warranty';

import { WarrantyManager } from '../../@types/warranty';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// routes
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Scrollbar from '../../components/Scrollbar';

import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../../components/_dashboard/user/list';
import DialogOwnerWarrantyManagement from './DialogOwnerWarrantyManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'contractId', label: 'Mã hợp đồng', alignRight: false },
  { id: 'fullname', label: 'Tên khách hàng', alignRight: false },
  { id: 'dateTime', label: 'Ngày tạo', alignRight: false },
  { id: 'description', label: 'Ghi chú', alignRight: false }
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
  array: WarrantyManager[],
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
    return filter(array, (_warranty) => {
      const username = `${_warranty.account.lastname} ${_warranty.account.firstname}`;
      return username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function WarrantyManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { warrantyList } = useSelector((state: RootState) => state.warrantyList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<WarrantyManager | null>(null);
  const [orderBy, setOrderBy] = useState('dateTime');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const availableWarranty = warrantyList.filter((waranty) => waranty.status);
  useEffect(() => {
    dispatch(getWarrantyList());
  }, [dispatch]);

  const handleClickOpen = (e: any, warranty: WarrantyManager) => {
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
    setSelected(warranty);
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

  const handleBlockProduct = (warrantyId: string) => {
    dispatch(deleteWarrantyApi(warrantyId));
  };

  const handleUnBlockProduct = (bracketId: string) => {
    // dispatch(updateBracket({ bracketId }, true));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - availableWarranty.length) : 0;

  const filteredUsers = applySortFilter(
    availableWarranty,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <>
      <Card>
        <UserListToolbar
          numSelected={0}
          filterName={filterName}
          placeholder="Tìm theo tên khách hàng..."
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
                rowCount={warrantyList.length}
                onRequestSort={handleRequestSort}
                numSelected={0}
                onSelectAllClick={() => {}}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { warrantyId, contractId, dateTime, account, status, description } = row;

                    return (
                      <TableRow
                        style={{ cursor: 'pointer' }}
                        key={warrantyId}
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
                            <Typography variant="subtitle2">{contractId}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left" style={{ maxWidth: '150px' }}>
                          {account.lastname} {account.firstname}
                        </TableCell>
                        <TableCell align="left" style={{ maxWidth: '150px' }}>
                          {fDateTime(dateTime)}
                        </TableCell>
                        <TableCell align="left" style={{ maxWidth: '150px' }}>
                          {description}
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
          count={availableWarranty.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, page) => setPage(page)}
          onRowsPerPageChange={(e) => handleChangeRowsPerPage}
        />
      </Card>
      {selected && (
        <DialogOwnerWarrantyManagement warranty={selected} open={open} onClose={handleClose} />
      )}
    </>
  );
}
