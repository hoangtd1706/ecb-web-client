import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { red, green, amber, teal } from '@material-ui/core/colors';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Typography,
} from '@material-ui/core';
import {
  Frame,
  DownloadButton,
} from '@nvdunginest/emis-mui';

import {
  alertActions,
  loadingActions,
  alertMessage,
  AppDispatch,
} from '../../../core';

import userService from '../services/user';
import contractService, { ContractCounterModel } from '../services/contract';

type TagInfoProps = {
  icon: IconProp,
  title: string,
  value: number,
  color: string,
  path: string,
}

function TagInfo({
  icon,
  title,
  value,
  color,
  path,
}: TagInfoProps): JSX.Element {
  const history = useHistory();
  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      style={{ cursor: 'pointer' }}
      onClick={() => { history.push(path); }}
    >
      <Grid item>
        <FontAwesomeIcon style={{ fontSize: '1.5rem', color: color }} icon={icon} />
      </Grid>
      <Grid item>
        <Typography variant="caption">{title}</Typography>
        <Typography variant="subtitle2">{`${value} hợp đồng`}</Typography>
      </Grid>
    </Grid>
  )
}

export default function Dashboard(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const [isCreator, setIsCreator] = React.useState<boolean>(false);
  const [isApprover, setIsApprover] = React.useState<boolean>(false);

  const [creatorCounter, setCreatorCounter] = React.useState({
    processing: 0,
    submitted: 0,
    approved: 0,
    waiting: 0,
  });

  const [approverCounter, setApproverCounter] = React.useState({
    submitted: 0,
    approved: 0,
    waiting: 0,
  });

  const getValueByStatus = (data: ContractCounterModel[], status: number): number => {
    const exist = data.find(x => x.contractStatus === status);
    if (exist === undefined) {
      return 0;
    }

    return exist.total;
  }

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      const checkCreator = await userService.checkRolePermission('CREATOR_ROLE');
      setIsCreator(checkCreator);

      if (checkCreator) {
        const data = await contractService.countByCreator();
        setCreatorCounter({
          processing: getValueByStatus(data, 0),
          approved: getValueByStatus(data, 2),
          submitted: getValueByStatus(data, 1),
          waiting: getValueByStatus(data, 3),
        });
      }

      const checkApprover = await userService.checkRolePermission('APPROVER_ROLE');
      setIsApprover(checkApprover);

      if (checkApprover) {
        const data = await contractService.countByApprover();

        setApproverCounter({
          approved: getValueByStatus(data, 2),
          submitted: getValueByStatus(data, 1),
          waiting: getValueByStatus(data, 3),
        });
      }
    }
    catch {
      dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
      setIsCreator(false);
      setIsApprover(false);
      setCreatorCounter({ waiting: 0, submitted: 0, approved: 0, processing: 0 });
      setApproverCounter({ waiting: 0, approved: 0, submitted: 0 });
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={2}>
      {isCreator && (
        <Grid item xs={12}>
          <Frame title="Quản lý hợp đồng B">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TagInfo
                  icon="sync-alt"
                  title="Hợp đồng đang xử lý"
                  value={creatorCounter.processing}
                  color={teal[700]}
                  path="/b-contract/creator/list/processing"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TagInfo
                  icon="hourglass-half"
                  title="Hợp đồng chờ phê duyệt"
                  value={creatorCounter.submitted}
                  color={amber[700]}
                  path="/b-contract/creator/list/submitted"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TagInfo
                  icon="check-circle"
                  title="Hợp đồng đã phê duyệt"
                  value={creatorCounter.approved}
                  color={green[700]}
                  path="/b-contract/creator/list/approved"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TagInfo
                  icon="history"
                  title="Hợp đồng chờ mở lại"
                  value={creatorCounter.waiting}
                  color={red[700]}
                  path="/b-contract/creator/list/waiting"
                />
              </Grid>
            </Grid>
          </Frame>
        </Grid>
      )}
      {isApprover && (
        <Grid item xs={12}>
          <Frame title="Phê duyệt hợp đồng B">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TagInfo
                  icon="hourglass-half"
                  title="Hợp đồng chờ phê duyệt"
                  value={approverCounter.submitted}
                  color={amber[700]}
                  path="/b-contract/approver/list/submitted"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TagInfo
                  icon="check-circle"
                  title="Hợp đồng đã phê duyệt"
                  value={approverCounter.approved}
                  color={green[700]}
                  path="/b-contract/approver/list/approved"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TagInfo
                  icon="history"
                  title="Hợp đồng chờ mở lại"
                  value={approverCounter.waiting}
                  color={red[700]}
                  path="/b-contract/approver/list/waiting"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DownloadButton
                  filename="ContractReport.xlsx"
                  url="/api/contract/contracts/getExcelReport"
                />
              </Grid>
            </Grid>
          </Frame>
        </Grid>
      )}
    </Grid>
  )
}