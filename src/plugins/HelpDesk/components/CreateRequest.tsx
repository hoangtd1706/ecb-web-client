import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Chip,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  IconButton,
  FormDialog,
  TextField,
  Editor,
} from '@nvdunginest/emis-mui';

import {
  alertActions,
  loadingActions,
  AppDispatch,
} from '../../../core';

import issueConstants from '../constants/issue';
import { IssueDetailContext } from '../stores/IssueDetailStore';
import userService from '../services/user';

type StepState = {
  userNumber: string;
  fullName: string;
}

const ACTIVITY_CODE = 8;

export default function CreateRequest(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const { state, createRequest } = React.useContext(IssueDetailContext);
  const { validActions } = state;
  const { actions } = issueConstants;

  const [content, setContent] = React.useState('');
  const [keyWord, setKeyWord] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [approvers, setApprovers] = React.useState<StepState[]>([]);

  const handleOpen = () => {
    setContent('');
    setApprovers([]);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleAddApprover = async () => {
    dispatch(loadingActions.show());
    try {
      const approver = await userService.getApproverByKeyWord(keyWord);
      if (!approvers.map(x => x.userNumber).includes(approver.userNumber)) {
        setApprovers([
          ...approvers,
          {
            fullName: approver.fullName,
            userNumber: approver.userNumber,
          }
        ]);
      }
    }
    catch {
      dispatch(alertActions.show('Không tìm thấy người này trong danh sách phê duyệt!', 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  const handleRemoveApprover = (userNumber: string) => {
    setApprovers(approvers.filter(approver => approver.userNumber !== userNumber));
  }

  const handleSubmit = async () => {
    if (approvers.length === 0) {
      dispatch(alertActions.show('Phải có tối thiểu 01 người phê duyệt!', 'error'));
    }
    else {
      setOpen(false);
      createRequest(state.issue.id, {
        activity: {
          activityCode: ACTIVITY_CODE,
          createdBy: '',
          createdByFullName: '',
          createdTime: new Date(),
          issueId: state.issue.id,
          content: content,
        },
        approvers: approvers.map(x => x.userNumber),
      });
    }
  }

  const checkPermission = (): boolean => validActions.includes(ACTIVITY_CODE);

  return (
    checkPermission() ?
      <Grid item>
        <FormDialog
          title={actions[ACTIVITY_CODE].name}
          onClose={handleClose}
          open={open}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={12} md={6}>
              <TextField
                label="Mã số/Họ tên người phê duyệt"
                type="text"
                value={keyWord}
                onChange={(event) => { setKeyWord(event.target.value); }}
              />
            </Grid>
            <Grid item xs={12} md={6} container spacing={1}>
              <Grid item>
                <IconButton
                  text="Phê duyệt"
                  color="success"
                  icon="signature"
                  variant="contained"
                  onClick={handleAddApprover}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container spacing={1} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Typography variant="caption">Người phê duyệt:</Typography>
                <div>
                  {approvers.map(approver => (
                    <Chip
                      style={{ margin: '4px' }}
                      key={approver.userNumber}
                      label={`${approver.userNumber}-${approver.fullName}`}
                      onDelete={() => { handleRemoveApprover(approver.userNumber); }}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Editor
                value={content}
                onChange={(content) => { setContent(content); }}
              />
            </Grid>
          </Grid>
        </FormDialog>
        <IconButton
          variant="contained"
          color={actions[ACTIVITY_CODE].color}
          tooltip={actions[ACTIVITY_CODE].name}
          icon={actions[ACTIVITY_CODE].icon}
          text={actions[ACTIVITY_CODE].name}
          onClick={handleOpen}
        />
      </Grid> :
      <></>
  )
}