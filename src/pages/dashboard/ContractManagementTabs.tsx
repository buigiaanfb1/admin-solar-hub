import archiveFill from '@iconify/icons-eva/archive-fill';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
// material
import { Box, Tab, Tabs } from '@material-ui/core';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import { AccountGeneral } from '../../components/_dashboard/user/account';
import AdminApprovedContractManagement from './AdminApprovedContractManagement ';
import AdminHistoryContractManagement from './AdminHistoryContractManagement';
import AdminInProgressContractManagement from './AdminInProgressContractManagement ';

// ----------------------------------------------------------------------

export default function ContractManagementTabs() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { cards, invoices, myProfile, addressBook, notifications } = useSelector(
    (state: RootState) => state.user
  );

  const [currentTab, setCurrentTab] = useState('approved');

  useEffect(() => {}, [dispatch]);

  const ACCOUNT_TABS = [
    {
      value: 'approved',
      label: 'Hợp đồng mới',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      value: 'inProgress',
      label: 'Đang thi công',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      value: 'history',
      label: 'Lịch sử',
      icon: <Icon icon={archiveFill} width={20} height={20} />,
      component: <AccountGeneral />
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
      {currentTab === 'approved' && (
        <div>
          <AdminApprovedContractManagement />
        </div>
      )}
      {currentTab === 'inProgress' && (
        <div>
          <AdminInProgressContractManagement />
        </div>
      )}
      {currentTab === 'history' && (
        <div>
          <AdminHistoryContractManagement />
        </div>
      )}
    </>
  );
}
