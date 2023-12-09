import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { batch } from 'react-redux';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getPackageList } from 'redux/slices/admin/package';
import { getPromotionList } from 'redux/slices/admin/promotion';
import { getProductList } from 'redux/slices/admin/product';
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import PackageNewForm from '../../components/_dashboard/product-package/PackageNewForm';

// ----------------------------------------------------------------------

export default function PackageManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { packageList } = useSelector((state: RootState) => state.packageList);
  const { promotionList } = useSelector((state: RootState) => state.promotionList);

  const isEdit = pathname.includes('edit');
  const currentPackage = packageList.find((pacKage) => pacKage.packageId === name);
  useEffect(() => {
    batch(() => {
      dispatch(getPackageList());
      dispatch(getProductList());
      dispatch(getPromotionList());
    });
  }, [dispatch]);

  return (
    <Page title="Tạo gói sản phẩm | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo gói sản phẩm' : 'Chỉnh sửa thông tin gói sản phẩm'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Tạo gói sản phẩm' : currentPackage?.name || 'Chỉnh sửa' }
          ]}
        />

        <PackageNewForm
          isEdit={isEdit}
          currentPackage={currentPackage}
          promotionList={promotionList.filter((promotion) => promotion.status)}
        />
      </Container>
    </Page>
  );
}
