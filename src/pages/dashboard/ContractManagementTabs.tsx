import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';
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

// ----------------------------------------------------------------------

export default function ContractManagementTabs() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { cards, invoices, myProfile, addressBook, notifications } = useSelector(
    (state: RootState) => state.user
  );

  const [currentTab, setCurrentTab] = useState('general');

  useEffect(() => {
    dispatch(getCards());
    dispatch(getAddressBook());
    dispatch(getInvoices());
    dispatch(getNotifications());
    dispatch(getProfile());
  }, [dispatch]);

  if (!myProfile) {
    return null;
  }

  if (!cards) {
    return null;
  }

  if (!notifications) {
    return null;
  }

  const ACCOUNT_TABS = [
    {
      value: 'contract',
      label: 'Hợp đồng',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      value: 'billing',
      label: 'Thanh toán',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AccountBilling cards={cards} addressBook={addressBook} invoices={invoices} />
    },
    {
      value: 'processing',
      label: 'Nhiệm vụ xử lí',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <AccountNotifications notifications={notifications} />
    },
    {
      value: 'history',
      label: 'Lịch sự truy cập',
      icon: <Icon icon={shareFill} width={20} height={20} />,
      component: <AccountSocialLinks myProfile={myProfile} />
    }
  ];

  return (
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
  );
}