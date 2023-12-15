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

import { FeedbackManager } from '../../@types/feedback';
import { getFeedbackList, deleteFeedbackApi } from '../../redux/slices/admin/feedback';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  UserListHead,
  UserListToolbar,
  AdminUserMoreMenu
} from '../../components/_dashboard/user/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'feedbackId', label: 'Mã gói', alignRight: false },
  { id: 'productFeedback', label: 'Gói sử dụng', alignRight: false },
  { id: 'name', label: 'Tên khách hàng', alignRight: false },
  { id: 'description', label: 'Đánh giá', alignRight: false },
  { id: 'rating', label: 'Đánh giá', alignRight: false },
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
  array: FeedbackManager[],
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
      (_feedback) => _feedback.packageId.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function FeedbackManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { feedbackList } = useSelector((state: RootState) => state.feedbackList);
  const availableFeedbackList = feedbackList.filter((feedback) => feedback.status);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<FeedbackManager | null>(null);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getFeedbackList());
  }, [dispatch]);

  const handleClickOpen = (e: any, feedback: FeedbackManager) => {
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - availableFeedbackList.length) : 0;

  const filteredUsers = applySortFilter(
    availableFeedbackList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Feedback từ khách hàng | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Feedback từ khách hàng"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Feedback từ khách hàng' }
          ]}
          action={<></>}
        />

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            placeholder="Tìm theo mã gói..."
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
                  rowCount={availableFeedbackList.length}
                  numSelected={0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        feedbackId,
                        account: { lastname, firstname },
                        package: { name, packageId },
                        status,
                        rating,
                        description
                      } = row;

                      return (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={feedbackId}
                          hover
                          tabIndex={-1}
                          role="checkbox"
                          onClick={(e: any) => handleClickOpen(e, row)}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            style={{ maxWidth: 200 }}
                          >
                            <div style={{ overflowWrap: 'break-word' }}>
                              <Typography variant="subtitle2" noWrap>
                                {packageId}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
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
                          <TableCell align="left">{rating}/5</TableCell>

                          <TableCell align="right">
                            <AdminUserMoreMenu
                              onBlock={() => handleDeleteFeedback(feedbackId)}
                              textFirstItem="Xoá feedback"
                              textFirstItemAfter="Kích hoạt"
                              noSecondOption
                              status={status}
                              id={feedbackId}
                              path={PATH_DASHBOARD.feedback.root}
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
            rowsPerPageOptions={[]}
            component="div"
            count={availableFeedbackList.length}
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
        {/* {selected && <DialogPackageManagement open={open} onClose={handleClose} />} */}
      </Container>
    </Page>
  );
}
