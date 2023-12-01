/* eslint-disable */
import * as Yup from 'yup';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

// material
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Checkbox,
  Grid,
  Stack,
  TextField,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Autocomplete
} from '@material-ui/core';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axiosIntegrated';
import { PATH_DASHBOARD } from 'routes/paths';
import { AuthUser } from '../../../@types/authentication';
import { TeamManager } from '../../../@types/team';
import { Image } from '../../../@types/product';
import Upload from './Upload';
import { RootState } from 'redux/store';
import { useSelector } from 'react-redux';
// import { roles, genders, loginTypes } from './roles';

// ----------------------------------------------------------------------

type TeamNewFormProps = {
  isEdit: boolean;
  currentTeam?: TeamManager;
  isDisabled?: boolean;
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        thousandSeparator
        valueIsNumericString
      />
    );
  }
);

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 }
];

export default function AdminTeamNewForm({
  isEdit = false,
  currentTeam,
  isDisabled = false
}: TeamNewFormProps) {
  console.log(currentTeam);
  const navigate = useNavigate();
  const { uploadImages } = useAuth();
  const { staffNotHaveTeamList } = useSelector((state: RootState) => state.teamList);

  const [staffLeaders, setStaffLeaders] = useState(
    staffNotHaveTeamList.filter((staff) => staff.isLeader)
  );

  const [staffs, setStaffs] = useState(staffNotHaveTeamList);

  useEffect(() => {
    let team = staffNotHaveTeamList.filter((staff) => staff.isLeader);
    let staffs = staffNotHaveTeamList.filter((staff) => !staff.isLeader);
    if (currentTeam?.staffLead) {
      team.push(currentTeam.staffLead);
    }

    if (currentTeam?.staff && currentTeam?.staff.length > 0) {
      staffs.push(...currentTeam?.staff);
    }

    setStaffLeaders(team);
    setStaffs(staffs);
  }, [staffNotHaveTeamList]);

  const { enqueueSnackbar } = useSnackbar();

  const NewTeamSchema = Yup.object().shape({
    leader: Yup.object().typeError('Vui lòng chọn nhóm trưởng'),
    member: Yup.array()
      .min(1, 'Vui lòng thêm ít nhất một thành viên')
      .max(5, 'Số lượng thành viên tối đa là 4')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      leader: currentTeam?.staffLead,
      member: currentTeam?.staff
    },
    validationSchema: NewTeamSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(values);
      try {
        if (isEdit) {
          let payload;

          let staffLeadId = currentTeam?.staffLead?.accountId;

          if (values.leader?.accountId !== staffLeadId) {
            payload = {
              leaderId: staffLeadId,
              newLeaderId: values.leader?.accountId,
              member: values?.member?.map((member) => ({ memberId: member.accountId }))
            };
          } else {
            payload = {
              leaderId: staffLeadId,
              member: values?.member?.map((member) => ({ memberId: member.accountId }))
            };
          }
          await axios.post('api/Team/add-team', payload);
        } else {
          await axios.post('api/Team/add-team', {
            leaderId: values?.leader?.accountId,
            member: values?.member?.map((member) => ({ memberId: member.accountId }))
          });
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Tạo nhóm thành công' : 'Cập nhật nhóm thành công', {
          variant: 'success'
        });
        navigate(PATH_DASHBOARD.team.list);
      } catch (error: any) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    setFieldTouched
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Stack spacing={3}>
                <Stack>
                  {staffLeaders.length > 0 && (
                    <Autocomplete
                      {...getFieldProps('leader')}
                      fullWidth
                      options={staffLeaders}
                      getOptionLabel={(option) =>
                        `${option.lastname} ${option.firstname} - ${option.username}`
                      }
                      onChange={(_, newValue) => setFieldValue('leader', newValue)}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Nhóm trưởng"
                          placeholder="Nhóm trưởng"
                          error={Boolean(touched.leader && errors.leader)}
                          helperText={touched.leader && errors.leader}
                        />
                      )}
                    />
                  )}
                </Stack>
                <Stack>
                  {staffs.length > 0 && (
                    <Autocomplete
                      {...getFieldProps('member')}
                      multiple
                      fullWidth
                      options={staffs}
                      getOptionLabel={(option) =>
                        `${option.lastname} ${option.firstname} - ${option.username}`
                      }
                      onChange={(_, newValue) => setFieldValue('member', newValue)}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Thành viên"
                          placeholder="Thành viên"
                          error={Boolean(touched.member && errors.member)}
                          helperText={touched.member && errors.member}
                        />
                      )}
                    />
                  )}
                </Stack>

                {!isDisabled && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Tạo nhóm' : 'Cập nhật'}
                    </LoadingButton>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </FormikProvider>
  );
}
