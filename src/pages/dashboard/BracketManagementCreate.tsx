import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getBracketList } from 'redux/slices/admin/bracket';
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AdminBracketNewForm from '../../components/_dashboard/bracket/AdminBracketNewForm';

// ----------------------------------------------------------------------

export default function BracketManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { bracketList } = useSelector((state: RootState) => state.bracketList);
  const isEdit = pathname.includes('edit');
  const currentBracket = bracketList.find((bracket) => bracket.bracketId === name);
  useEffect(() => {
    dispatch(getBracketList());
  }, [dispatch]);

  return (
    <Page title="Thêm khung đỡ | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm khung đỡ' : 'Chỉnh sửa thông tin khung đỡ'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Thêm khung đỡ' : currentBracket?.name || 'Chỉnh sửa' }
          ]}
        />

        <AdminBracketNewForm isEdit={isEdit} currentBracket={currentBracket} />
      </Container>
    </Page>
  );
}
