import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getTeamList, getStaffNotHaveTeamList } from 'redux/slices/admin/team';
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AdminTeamNewForm from '../../components/_dashboard/team/AdminTeamNewForm';

// ----------------------------------------------------------------------

export default function TeamManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { teamList } = useSelector((state: RootState) => state.teamList);
  console.log(teamList);
  const isEdit = pathname.includes('edit');
  const currentTeam = teamList.find((team) => team.staffLead.accountId === name);
  useEffect(() => {
    dispatch(getTeamList());
    dispatch(getStaffNotHaveTeamList());
  }, [dispatch]);

  return (
    <Page title="Thêm nhóm | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm nhóm' : 'Chỉnh sửa thông tin nhóm'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Thêm nhóm' : currentTeam?.staffLead.accountId || 'Chỉnh sửa' }
          ]}
        />

        <AdminTeamNewForm isEdit={isEdit} currentTeam={currentTeam} />
      </Container>
    </Page>
  );
}
