import React from 'react';
import {
  Grid,
} from '@material-ui/core';

import {
  IconButton,
  FormDialog,
  Editor,
} from '@nvdunginest/emis-mui';

import issueConstants from '../constants/issue';
import { IssueDetailContext } from '../stores/IssueDetailStore';
import { ActivityModel } from '../services/activity';

type Props = {
  activityCode: number;
}

export default function ActionDetail({
  activityCode,
}: Props): JSX.Element {
  const { state, createActivity } = React.useContext(IssueDetailContext);
  const { validActions } = state;
  const { actions } = issueConstants;

  const [content, setContent] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setContent('');
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = async () => {
    setOpen(false);
    const model: ActivityModel = {
      activityCode: activityCode,
      createdBy: '',
      createdByFullName: '',
      createdTime: new Date(),
      issueId: state.issue.id,
      content: content,
    }
    createActivity(state.issue.id, activityCode, model);
  }

  const checkPermission = (): boolean => validActions.includes(activityCode);

  return (
    checkPermission() ?
      <Grid item>
        <FormDialog
          title={actions[activityCode].name}
          onClose={handleClose}
          open={open}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={1} alignItems="flex-end">
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
          color={actions[activityCode].color}
          tooltip={actions[activityCode].name}
          icon={actions[activityCode].icon}
          text={actions[activityCode].name}
          onClick={handleOpen}
        />
      </Grid> :
      <></>
  )
}