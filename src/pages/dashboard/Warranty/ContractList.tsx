import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Radio,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { useSnackbar } from 'notistack5';
import { getContractList } from 'redux/slices/admin/contract';

// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
// routes
// hooks
import useSettings from '../../../hooks/useSettings';
// @types
import { ConstructionContractManager } from '../../../@types/contract';
// components
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead } from '../../../components/_dashboard/user/list';
import ListToolbar from './ListToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', label: '', alignRight: false },
  { id: 'contractId', label: 'Mã hợp đồng', alignRight: false },
  { id: 'packageName', label: 'Tên gói', alignRight: false },
  { id: 'bracket', label: 'Tên khung đỡ', alignRight: false },
  { id: 'username', label: 'Tên khách hàng', alignRight: false },
  { id: 'totalcost', label: 'Tổng giá', alignRight: false }
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
  array: ConstructionContractManager[],
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
    return filter(array, (_contract) => {
      const username = `${_contract.customer.lastname} ${_contract.customer.firstname}`;
      return username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OwnerRequestList({
  onSetValue
}: {
  onSetValue: (key: string, value: string) => void;
}) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { constructionContractList } = useSelector((state: RootState) => state.contractList);
  const completedConstructionContractList = constructionContractList.filter(
    (contract) => contract.status === '3'
  );
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string>('');
  const [orderBy, setOrderBy] = useState('username');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getContractList());
  }, [dispatch]);

  useEffect(() => {
    onSetValue('contractId', selected);
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - completedConstructionContractList.length) : 0;

  const filteredUsers = applySortFilter(
    completedConstructionContractList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Card>
      <ListToolbar
        filterName={filterName}
        placeholder="Tìm theo tên khách hàng..."
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={completedConstructionContractList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={() => {}}
              isShowCheckbox={false}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const {
                    constructioncontractId,
                    bracket: { name: bracketName },
                    status,
                    startdate,
                    totalcost,
                    enddate,
                    description,
                    staff: { firstname, lastname },
                    customer: { firstname: firstnameCus, lastname: lastnameCus },
                    package: { name: packageName }
                  } = row;

                  const isItemSelected = selected.indexOf(constructioncontractId) !== -1;

                  return (
                    <TableRow
                      hover
                      key={constructioncontractId}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Radio
                          checked={isItemSelected}
                          onClick={() => handleClick(constructioncontractId)}
                        />
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '150px' }}>
                        {constructioncontractId}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '150px' }}>
                        {packageName}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '150px' }}>
                        {bracketName}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '150px' }}>
                        {`${lastnameCus} ${firstnameCus}`}
                      </TableCell>
                      <TableCell align="left" style={{ maxWidth: '150px' }}>
                        <span>
                          {totalcost?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                        </span>
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
        rowsPerPageOptions={[]}
        component="div"
        count={completedConstructionContractList.length}
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
