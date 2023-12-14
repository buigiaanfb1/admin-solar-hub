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
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { getPaymentList } from 'redux/slices/admin/payment';

import { PaymentManager } from '../../@types/admin-payment';
import { deleteFeedbackApi } from '../../redux/slices/admin/feedback';
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
import { UserListHead, UserListToolbar } from '../../components/_dashboard/user/list';
import DialogPaymentManagement from './DialogPaymentManagement';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'paymentId', label: 'Mã thanh toán', alignRight: false },
  { id: 'constructionContractId', label: 'Mã hợp đồng', alignRight: false },
  { id: 'fullname', label: 'Tên khách hàng', alignRight: false },
  { id: 'amount', label: 'Số tiền', alignRight: false },
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
  array: PaymentManager[],
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
    return filter(array, (_payment) => {
      const username = `${_payment.account.lastname} ${_payment.account.firstname}`;
      return username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export const handleRenderLabel = (payment: PaymentManager) => {
  if (payment.isDeposit && payment.status === 'Paid') {
    return (
      <Label variant="ghost" color="secondary">
        CHƯA CỌC
      </Label>
    );
  }
  if (payment.isDeposit && payment.status === 'success') {
    return (
      <Label variant="ghost" color="warning">
        ĐÃ THANH TOÁN CỌC
      </Label>
    );
  }

  if (!payment.isDeposit && payment.status === 'Paid') {
    return (
      <Label variant="ghost" color="info">
        CHƯA TẤT TOÁN
      </Label>
    );
  }

  if (!payment.isDeposit && payment.status === 'success') {
    return (
      <Label variant="ghost" color="success">
        ĐÃ TẤT TOÁN
      </Label>
    );
  }

  return (
    <Label variant="ghost" color="error">
      CHƯA XÁC ĐỊNH
    </Label>
  );
};

export default function PaymentManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { paymentList } = useSelector((state: RootState) => state.paymentList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<PaymentManager | null>(null);
  const [orderBy, setOrderBy] = useState('status');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getPaymentList());
  }, [dispatch]);

  const handleClickOpen = (e: any, feedback: PaymentManager) => {
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
    setSelected(feedback);
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

  const handleDeleteFeedback = (feedbackId: string) => {
    dispatch(deleteFeedbackApi(feedbackId));
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - paymentList.length) : 0;

  const filteredUsers = applySortFilter(paymentList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Quản lí thanh toán | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Quản lí thanh toán"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Quản lí thanh toán' }
          ]}
          action={<></>}
        />

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
                  rowCount={paymentList.length}
                  numSelected={0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        paymentId,
                        account: { lastname, firstname },
                        constructionContractId,
                        payDate,
                        status,
                        amount
                      } = row;

                      return (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={paymentId}
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          onClick={(e: any) => handleClickOpen(e, row)}
                        >
                          <TableCell align="left">{paymentId}</TableCell>
                          <TableCell align="left">{constructionContractId}</TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            style={{ maxWidth: 200 }}
                          >
                            <div style={{ overflowWrap: 'break-word' }}>
                              <Typography variant="subtitle2" noWrap>
                                {lastname} {firstname}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <Typography>
                              {amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{handleRenderLabel(row)}</TableCell>
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
            count={paymentList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
        {selected && (
          <DialogPaymentManagement open={open} onClose={handleClose} payment={selected} />
        )}
      </Container>
    </Page>
  );
}
