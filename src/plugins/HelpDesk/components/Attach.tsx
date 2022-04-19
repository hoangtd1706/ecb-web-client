import React from 'react';
import {
  Grid,
} from '@material-ui/core';
import {
  UploadButton,
} from '@nvdunginest/emis-mui';

import issueConstants from '../constants/issue';
import { IssueDetailContext } from '../stores/IssueDetailStore';

const ACTIVITY_CODE = 11;

export default function Attach(): JSX.Element {
  const { state, attach } = React.useContext(IssueDetailContext);
  const { validActions } = state;
  const { actions } = issueConstants;

  const handleSubmit = async (files: File[]) => {
    if (Array.isArray(files)) {
      attach(state.issue.id, files[0]);
    }
  }

  const checkPermission = (): boolean => validActions.includes(ACTIVITY_CODE);

  return (
    checkPermission() ?
      <Grid item>
        <UploadButton
          title="Chọn tập tin tải lên"
          variant="contained"
          color={actions[ACTIVITY_CODE].color}
          text={actions[ACTIVITY_CODE].name}
          tooltip={actions[ACTIVITY_CODE].name}
          filesLimit={1}
          acceptedFiles={[
            '.doc',
            '.docx',
            '.xls',
            '.xlsx',
            '.pdf',
            '.rar',
            '.zip',
          ]}
          onSubmit={handleSubmit}
        />
      </Grid> :
      <></>
  )
}