import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import bellFill from '@iconify/icons-eva/bell-fill';
import archiveFill from '@iconify/icons-eva/archive-fill';
import roundReceipt from '@iconify/icons-ic/round-receipt';
// material
import { Tab, Box, Tabs } from '@material-ui/core';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { AccountGeneral } from '../../components/_dashboard/user/account';
import AdminUserList from './AdminUserList';
import AdminUserCustomerList from './AdminUserCustomerList';

// ----------------------------------------------------------------------

export default function ContractManagementTabs() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { cards, invoices, myProfile, addressBook, notifications } = useSelector(
    (state: RootState) => state.user
  );

  const [currentTab, setCurrentTab] = useState('internal');

  useEffect(() => {}, [dispatch]);

  const ACCOUNT_TABS = [
    {
      value: 'internal',
      label: 'Tài khoản nội bộ',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AdminUserList />
    },
    {
      value: 'external',
      label: 'Tài khoản khách hàng',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AdminUserCustomerList />
    }
  ];

  return (
    <>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      <Box sx={{ mb: 5 }} />
      {currentTab === 'internal' && (
        <div>
          <AdminUserList />
        </div>
      )}
      {currentTab === 'external' && (
        <div>
          <AdminUserCustomerList />
        </div>
      )}
    </>
  );
}
