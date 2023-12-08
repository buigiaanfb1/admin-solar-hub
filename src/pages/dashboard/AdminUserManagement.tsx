// material
import { Button, Container, Grid } from '@material-ui/core';
import { PATH_DASHBOARD } from 'routes/paths';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import AdminUserManagementTabs from './AdminUserManagementTabs';
// ----------------------------------------------------------------------

export default function AdminUserManagement() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="Bảng điều khiển: Danh sách tài khoản | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          mb={0}
          heading="Danh sách tài khoản"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách tài khoản' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.newUser}
              startIcon={<Icon icon={plusFill} />}
            >
              Tạo tài khoản
            </Button>
          }
        />
        <Grid container spacing={0}>
          <Grid item xs={12} md={12}>
            <AdminUserManagementTabs />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
