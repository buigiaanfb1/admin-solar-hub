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
import { thumbnailItemsExternal } from 'components/_dashboard/product/CarouselProduct';
import useAuth from 'hooks/useAuth';
import { BracketManager } from '../../@types/bracket';
import { getSurveyList, updateSurvey, deleteSurveyApi } from '../../redux/slices/staff/survey';
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
import { SurveyManager } from '../../@types/survey';
import { ConstructionContractManager } from '../../@types/contract';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'surveyId', label: 'Mã khảo sát', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'note', label: 'Ghi chú', alignRight: false },
  { id: 'tools', label: '', alignRight: false },
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
  array: SurveyManager[],
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
      (_survey) => _survey.note.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SurveyManagement() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { surveyList } = useSelector((state: RootState) => state.staffSurveyList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<SurveyManager | null>(null);
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getSurveyList(user?.userInfo.accountId));
  }, [dispatch]);

  const handleClickOpen = (e: any, survey: SurveyManager) => {
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
    setSelected(survey);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRenderContractButton = (
    contract: ConstructionContractManager,
    suveryId: string,
    accountId: string | null
  ) => {
    if (!contract) {
      return (
        <Button
          onClick={() =>
            navigate(
              `${PATH_DASHBOARD.contract.newContractStaff}?suveryId=${suveryId}&accountId=${
                accountId || ''
              }`
            )
          }
          variant="contained"
        >
          Tạo hợp đồng
        </Button>
      );
    }

    return (
      <Button
        onClick={() => navigate(`/dashboard/contract/${contract.constructioncontractId}/edit`)}
        variant="contained"
      >
        Xem hợp đồng
      </Button>
    );
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleBlockSurvey = (surveyId: string) => {
    dispatch(deleteSurveyApi(surveyId, user?.userInfo.accountId));
  };

  const handleUnBlocSurvey = (surveyId: string) => {
    dispatch(updateSurvey({ surveyId, status: true }, user?.userInfo.accountId));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - surveyList.length) : 0;

  const filteredUsers = applySortFilter(surveyList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Danh sách các khảo sát | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách các khảo sát"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách các khảo sát' }
          ]}
          action={
            // <Button
            //   variant="contained"
            //   component={RouterLink}
            //   to={PATH_DASHBOARD.survey.newSurvey}
            //   startIcon={<Icon icon={plusFill} />}
            // >
            //   Tạo khảo sát
            // </Button>
            <></>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            placeholder="Tìm khảo sát theo ghi chú..."
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
                  rowCount={surveyList.length}
                  numSelected={0}
                  onRequestSort={() => {}}
                  onSelectAllClick={() => {}}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { surveyId, note, description, status, constructionContract, request } =
                        row;

                      return (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={surveyId}
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
                              <Typography variant="subtitle2">{surveyId}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {description}
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '150px' }}>
                            {note}
                          </TableCell>
                          <TableCell align="left" style={{ maxWidth: '100px' }}>
                            {handleRenderContractButton(
                              constructionContract,
                              surveyId,
                              request?.accountId
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <AdminUserMoreMenu
                              onBlock={() => handleBlockSurvey(surveyId)}
                              onUnblock={() => handleUnBlocSurvey(surveyId)}
                              textFirstItem="Đóng khảo sát"
                              textFirstItemAfter="Mở lại khảo sát"
                              status={status}
                              id={surveyId}
                              path={PATH_DASHBOARD.survey.root}
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
            count={surveyList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
        {/* {selected && (
          <DialogBracketManagement open={open} onClose={handleClose} bracket={selected} />
        )} */}
      </Container>
    </Page>
  );
}
