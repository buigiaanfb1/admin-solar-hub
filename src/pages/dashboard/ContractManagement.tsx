// material
import { Container, Grid } from '@material-ui/core';
import AccountBillingAddressBook from 'components/_dashboard/contract-management/AccountBillingAddressBook';
import { PATH_DASHBOARD } from 'routes/paths';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import ContractManagementTabs from './ContractManagementTabs';
// ----------------------------------------------------------------------

export default function ContractManagement() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="Bảng điều khiển: Hệ thống | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Hợp đồng"
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Hợp đồng' }]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AccountBillingAddressBook />
          </Grid>
          <Grid item xs={12} md={12}>
            <ContractManagementTabs />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
