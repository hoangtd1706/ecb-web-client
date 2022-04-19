import React from "react";
import { Grid } from "@material-ui/core";

import { IconButton, FormDialog, Editor } from "@nvdunginest/emis-mui";

import { useTypedSelector } from "../../../../core";

import { ContractDetailContext } from "../../stores/ContractDetailStore";
import { ActionRequestModel } from "../../services/request";

export default function CheckRequest(): JSX.Element {
  const { state, check } = React.useContext(ContractDetailContext);
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
    check(contract.contractNumber, model);
  };

  const checkPermission = (): boolean => {
    if (contract.status !== "S" && contract.status !== "W") {
      return false;
    }

    const activeRequest = contract.requests.find((x) => x.isActive);
    if (activeRequest === undefined) {
      return false;
    }

    if (currentUser === null) {
      return false;
    }

    const step = activeRequest.steps.find(
      (x) => x.userNumber === currentUser.employeeId
    );
    if (step === undefined) {
      return false;
    }

    if (step.isApproved || step.isRejected || step.isFinish) {
      return false;
    }

    return true;
  };

  return checkPermission() ? (
    <Grid item>
      <FormDialog
        title={
          contract.status === "S"
            ? "Xác nhận hợp đồng"
            : "Đồng ý mở lại hợp đồng"
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
        color="success"
        tooltip={
          contract.status === "S"
            ? "Xác nhận hợp đồng"
            : "Đồng ý mở lại hợp đồng"
        }
        icon="check-circle"
        text={contract.status === "S" ? "Xác nhận" : "Đồng ý"}
        onClick={handleOpen}
      />
    </Grid>
  ) : (
    <></>
  );
}
