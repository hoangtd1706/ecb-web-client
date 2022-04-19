import React from "react";
import { Typography, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Frame, DownloadButton, IconButton } from "@nvdunginest/emis-mui";

import { useTypedSelector } from "../../../../core";

import format from "../../../../configs/format";
import { ContractDetailContext } from "../../stores/ContractDetailStore";

export default function ContractAttachments(): JSX.Element {
  const { formatDate } = format;
  const { state, removeAttachment } = React.useContext(ContractDetailContext);
  const { contract } = state;
  const currentUser = useTypedSelector((state) => state.auth.user);

  const checkPermission = (): boolean => {
    if (contract.status !== "P") {
      return false;
    }

    if (currentUser === null) {
      return false;
    }

    if (contract.createdBy !== currentUser.employeeId) {
      return false;
    }

    return true;
  };

  const handleDeleteFile = (id: number) => {
    removeAttachment(contract.contractNumber, id);
  };

  return (
    <Frame title="Tài liệu đính kèm">
      <Grid container spacing={1}>
        {contract.attachments.map((attachment) => (
          <Grid container item xs={12} md={6} key={attachment.id}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                <FontAwesomeIcon icon="paperclip" />
                {attachment.fileName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">
                {formatDate(
                  new Date(attachment.createdTime),
                  "hh:mm dd/MM/yyyy"
                )}
                {attachment.isPrivate && <FontAwesomeIcon icon="shield-alt" />}
                <DownloadButton
                  filename={attachment.fileName}
                  url={`/api/contract/contracts/${contract.contractNumber}/attachments/${attachment.id}`}
                  label="Tải"
                />
                {checkPermission() && (
                  <IconButton
                    icon="trash-alt"
                    text="Xóa"
                    color="danger"
                    onClick={() => {
                      handleDeleteFile(attachment.id);
                    }}
                  />
                )}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Frame>
  );
}
