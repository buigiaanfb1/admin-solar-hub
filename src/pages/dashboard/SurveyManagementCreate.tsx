import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import { getSurveyList } from 'redux/slices/staff/survey';
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import SurveyNewForm from '../../components/_dashboard/survey/SurveyNewForm';

// ----------------------------------------------------------------------

export default function SurveyManagementCreate() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const requestId = queryParams.get('requestId');
  // TODO: research why it is name not accountId?
  const { name } = useParams();
  const { surveyList } = useSelector((state: RootState) => state.staffSurveyList);
  const isEdit = pathname.includes('edit');
  const currentSurvey = surveyList.find((survey) => survey.surveyId === name);
  useEffect(() => {
    dispatch(getSurveyList(user?.userInfo.accountId));
  }, [dispatch]);

  return (
    <Page title="Thêm khảo sát | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm khảo sát' : 'Chỉnh sửa khảo sát'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: !isEdit ? 'Thêm khảo sát' : currentSurvey?.surveyId || 'Chỉnh sửa' }
          ]}
        />

        <SurveyNewForm isEdit={isEdit} requestId={requestId} currentSurvey={currentSurvey} />
      </Container>
    </Page>
  );
}
