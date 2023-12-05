import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getWarrantyList } from 'redux/slices/admin/warranty';
import WarrantyNewForm from 'components/_dashboard/warranty/WarrantyNewForm';

import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function WarrantyManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { warrantyList } = useSelector((state: RootState) => state.warrantyList);
  const isEdit = pathname.includes('edit');
  const currentWarranty = warrantyList.find((warranty) => warranty.warrantyId === name);

  console.log(currentWarranty);
  useEffect(() => {
    dispatch(getWarrantyList());
  }, [dispatch]);

  return (
    <Page title="Bảo hành | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Bảo hành' : 'Chỉnh sửa thông tin bảo hành'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Bảo hành' : currentWarranty?.warrantyId || 'Chỉnh sửa' }
          ]}
        />
        <WarrantyNewForm isEdit={isEdit} currentWarranty={currentWarranty} />
      </Container>
    </Page>
  );
}
