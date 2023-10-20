import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getUserList } from '../../redux/slices/admin/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AdminUserNewForm from '../../components/_dashboard/user/AdminUserNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { userList } = useSelector((state: RootState) => state.userList);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => user.accountId === name);
  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  return (
    <Page title="Tạo mới tài khoản | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo mới tài khoản' : 'Chỉnh sửa thông tin tài khoản'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Tạo mới tài khoản' : currentUser?.username || 'Chỉnh sửa' }
          ]}
        />

        <AdminUserNewForm
          isEdit={isEdit}
          currentUser={currentUser}
          currentAdmin={{ ...user, role: user?.role || 'Staff' }}
        />
      </Container>
    </Page>
  );
}
