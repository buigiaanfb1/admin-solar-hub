import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getContractListByStaff } from 'redux/slices/admin/contract';
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AdminContractNewForm from '../../components/_dashboard/contract/AdminContractNewForm';

// ----------------------------------------------------------------------

export default function ContractManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { constructionContractList } = useSelector((state: RootState) => state.contractList);
  const queryParams = new URLSearchParams(search);
  const customerId = queryParams.get('accountId');
  const surveyId = queryParams.get('surveyId');
  const isEdit = pathname.includes('edit');
  const currentConstructionContract = constructionContractList.find(
    (contract) => contract.constructioncontractId === name
  );

  useEffect(() => {
    dispatch(getContractListByStaff(user?.userInfo.accountId));
  }, [dispatch]);

  return (
    <Page title="Tạo hợp đồng | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo hợp đồng' : 'Chỉnh sửa hợp đồng'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: !isEdit
                ? 'Tạo hợp đồng'
                : currentConstructionContract?.constructioncontractId || 'Chỉnh sửa'
            }
          ]}
        />

        <AdminContractNewForm
          isEdit={isEdit}
          currentContructionContract={currentConstructionContract}
          staffId={user?.userInfo.accountId}
          customerId={customerId}
          surveyId={surveyId}
        />
      </Container>
    </Page>
  );
}
