import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  Divider,
  Chip,
} from '@material-ui/core';
import {
  TextField,
  IconButton,
  Frame,
} from '@nvdunginest/emis-mui';

import {
  AppDispatch,
  alertActions,
  alertMessage,
  loadingActions,
} from '../../../core';

import viewerService, {
  ProjectViewerModel,
  Viewer,
} from '../services/reportViewer';

type ProjectUsersProps = {
  viewers: Viewer[];
  projectCode: string;
  projectName: string;
  onCreate: (projectCode: string, userNumber: string) => void;
  onRemove: (projectCode: string, userNumber: string) => void;
}

function ProjectUsers({
  viewers,
  projectCode,
  projectName,
  onCreate,
  onRemove,
}: ProjectUsersProps): JSX.Element {
  const [userNumber, setUserNumber] = React.useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNumber(event.target.value);
  };

  return (
    <Frame title={`${projectCode} - ${projectName}`}>
      <Grid container alignItems="flex-end" spacing={1}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Mã số nhân viên"
            required
            type="text"
            value={userNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <IconButton
            icon="plus"
            color="primary"
            text="Thêm"
            variant="contained"
            onClick={() => { onCreate(projectCode, userNumber); }}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          {viewers.map((user, index) => (
            <Chip
              style={{ margin: '4px' }}
              key={index}
              label={`${user.userNumber}-${user.userFullName}`}
              onDelete={() => { onRemove(projectCode, user.userNumber); }}
              color="primary"
              variant="outlined"
              size="small"

            />
          ))}
        </Grid>
      </Grid>
    </Frame>
  )
}

export default function PfmUsers(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const [projects, setProjects] = React.useState<ProjectViewerModel[]>([]);

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setProjects(await viewerService.get('pfm'));
    }
    catch {
      dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  const handleCreate = async (projectCode: string, userNumber: string) => {
    dispatch(loadingActions.show());
    try {
      await viewerService.create('pfm', projectCode, userNumber);
      dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
      refresh();
    }
    catch {
      dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
      dispatch(loadingActions.hide());
    }
  }

  const handleRemove = async (projectCode: string, userNumber: string) => {
    dispatch(loadingActions.show());
    try {
      await viewerService.remove('pfm', projectCode, userNumber);
      dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
      refresh();
    }
    catch {
      dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
      dispatch(loadingActions.hide());
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={2}>
      {projects.map(project => (
        <Grid item xs={12} key={project.projectCode}>
          <ProjectUsers
            viewers={project.viewers}
            projectCode={project.projectCode}
            projectName={project.projectName}
            onCreate={handleCreate}
            onRemove={handleRemove}
          />
        </Grid>
      ))}
    </Grid>
  )
}