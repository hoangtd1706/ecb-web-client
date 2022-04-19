import React from "react";
import { Grid } from "@material-ui/core";
import { IconButton, FormDialog, Editor } from "@nvdunginest/emis-mui";

import { useTypedSelector } from "../../../../core";

import { ContractDetailContext } from "../../stores/ContractDetailStore";
import { ActionRequestModel } from "../../services/request";

export default function CancelRequest(): JSX.Element {
  const { state, cancel } = React.useContext(ContractDetailContext);
  const currentUser = useTypedSelector((state) => state.auth.user);
  const { contract } = state;

  const [content, setContent] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setContent("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setOpen(false);
    const model: ActionRequestModel = {
      content: content,
    };
    cancel(contract.contractNumber, model);
  };

  const checkPermission = (): boolean => {
    if (currentUser === null) {
      return false;
    }
    if (contract.createdBy !== currentUser.employeeId) {
      return false;
    }
    if (contract.status !== "S" && contract.status !== "W") {
      return false;
    }

    return true;
  };

  return checkPermission() ? (
    <Grid item>
      <FormDialog
        title={
          contract.status === "S"
            ? "Hủy yêu cầu phê duyệt"
            : "Hủy mở lại hợp đồng"
        }
        onClose={handleClose}
        open={open}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={12}>
            <Editor
              value={content}
              onChange={(content) => {
                setContent(content);
              }}
            />
          </Grid>
        </Grid>
      </FormDialog>
      <IconButton
        variant="contained"
        color={contract.status === "S" ? "danger" : "warning"}
        tooltip={
          contract.status === "S"
            ? "Hủy yêu cầu phê duyệt"
            : "Hủy mở lại hợp đồng"
        }
        icon={contract.status === "S" ? "stop-circle" : "minus-circle"}
        text={contract.status === "S" ? "Hủy yêu cầu" : "Hủy mở lại"}
        onClick={handleOpen}
      />
    </Grid>
  ) : (
    <></>
  );
}
