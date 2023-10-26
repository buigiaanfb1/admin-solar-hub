import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getProductList } from 'redux/slices/admin/product';
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AdminProductNewForm from '../../components/_dashboard/product/AdminProductNewForm';

// ----------------------------------------------------------------------

export default function ProductManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { productList } = useSelector((state: RootState) => state.productList);
  const isEdit = pathname.includes('edit');
  const currentProduct = productList.find((promote) => promote.productId === name);
  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  return (
    <Page title="Thêm sản phẩm | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm sản phẩm' : 'Chỉnh sửa thông tin sản phẩm'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Thêm sản phẩm' : currentProduct?.name || 'Chỉnh sửa' }
          ]}
        />

        <AdminProductNewForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
