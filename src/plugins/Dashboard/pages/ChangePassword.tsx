import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
} from '@material-ui/core';
import {
  IconButton,
  TextField,
  Frame,
} from '@nvdunginest/emis-mui';

import accountService, {
  ChangePasswordModel,
} from '../services/account';

import {
  AppDispatch,
  alertActions,
  alertMessage,
  loadingActions,
} from '../../../core';

const initialState: ChangePasswordModel = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export default function ChangePassword(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const [state, setState] = React.useState<ChangePasswordModel>(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value });
  }

  const handleSave = async () => {
    dispatch(loadingActions.show());
    try {
      await accountService.changePassword(state);
      dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
      setState(initialState);
    }
    catch {
      dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  return (
    <Frame title="Đổi mật khẩu">
      <Grid container alignItems="flex-end">
        <Grid container item xs={12} md={6} spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="oldPassword"
              label="Mật khẩu hiện tại"
              value={state.oldPassword}
              type="password"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="newPassword"
              label="Mật khẩu mới"
              value={state.newPassword}
              type="password"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              value={state.confirmPassword}
              type="password"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} container spacing={1}>
            <Grid item>
              <IconButton
                text="Đổi mật khẩu"
                icon="sync-alt"
                variant="contained"
                onClick={handleSave}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={6}></Grid>
      </Grid>
    </Frame>
  );
}
