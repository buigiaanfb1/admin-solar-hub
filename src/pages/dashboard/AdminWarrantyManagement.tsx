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
import WarrantyManagementTabs from './WarrantyManagementTabs';
// ----------------------------------------------------------------------

export default function ContractManagement() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="Quản lí bảo hành | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          mb={0}
          heading="Danh sách các báo cáo bảo hành"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách các báo cáo bảo hành' }
          ]}
        />
        <Grid container spacing={0}>
          {/* <Grid item xs={12} md={12}>
            <AccountBillingAddressBook />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <WarrantyManagementTabs />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
