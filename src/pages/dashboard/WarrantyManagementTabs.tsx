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
import AdminInprogressWarrantyManagement from './AdminInprogressWarrantyManagement';
import AdminCompletedWarrantyManagement from './AdminCompletedWarrantyManagement';

// ----------------------------------------------------------------------

export default function WarrantyManagementTabs() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { cards, invoices, myProfile, addressBook, notifications } = useSelector(
    (state: RootState) => state.user
  );

  const [currentTab, setCurrentTab] = useState('inProgress');

  useEffect(() => {}, [dispatch]);

  const ACCOUNT_TABS = [
    {
      value: 'inProgress',
      label: 'Đang hoạt động',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AdminInprogressWarrantyManagement />
    },
    {
      value: 'completed',
      label: 'Hoàn thành',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AdminCompletedWarrantyManagement />
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
      {currentTab === 'inProgress' && (
        <div>
          <AdminInprogressWarrantyManagement />
        </div>
      )}
      {currentTab === 'completed' && (
        <div>
          <AdminCompletedWarrantyManagement />
        </div>
      )}
    </>
  );
}
