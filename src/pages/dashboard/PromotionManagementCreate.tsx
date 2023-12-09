import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getPromotionList } from 'redux/slices/admin/promotion';
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AdminPromotionNewForm from '../../components/_dashboard/promotion/AdminPromotionNewForm';

// ----------------------------------------------------------------------

export default function PromotionManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { promotionList } = useSelector((state: RootState) => state.promotionList);
  const isEdit = pathname.includes('edit');
  const currentPromotion = promotionList.find((promote) => promote.promotionId === name);
  useEffect(() => {
    dispatch(getPromotionList());
  }, [dispatch]);

  return (
    <Page title="Tạo khuyến mãi | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo khuyến mãi' : 'Chỉnh sửa thông tin khuyến mãi'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Tạo khuyến mãi' : currentPromotion?.title || 'Chỉnh sửa' }
          ]}
        />

        <AdminPromotionNewForm isEdit={isEdit} currentPromotion={currentPromotion} />
      </Container>
    </Page>
  );
}
