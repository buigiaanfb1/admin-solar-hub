import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';
import archiveFill from '@iconify/icons-eva/archive-fill';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { Container, Tab, Box, Tabs } from '@material-ui/core';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import {
  getCards,
  getProfile,
  getInvoices,
  getAddressBook,
  getNotifications
} from '../../redux/slices/user';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountNotifications,
  AccountChangePassword
} from '../../components/_dashboard/user/account';
import AdminPendingContractManagement from './AdminPendingContractManagement';

// ----------------------------------------------------------------------

export default function ContractManagementTabs() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { cards, invoices, myProfile, addressBook, notifications } = useSelector(
    (state: RootState) => state.user
  );

  const [currentTab, setCurrentTab] = useState('pending');

  useEffect(() => {}, [dispatch]);

  const ACCOUNT_TABS = [
    {
      value: 'pending',
      label: 'Chờ duyệt',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      value: 'approved',
      label: 'Đã duyệt',
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
      {currentTab === 'pending' && (
        <div>
          <AdminPendingContractManagement />
        </div>
      )}
    </>
  );
}
