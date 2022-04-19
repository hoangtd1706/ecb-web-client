import React from "react";
import { useDispatch } from "react-redux";
import { Chip, Grid, Typography } from "@material-ui/core";
import {
  IconButton,
  FormDialog,
  TextField,
  Editor,
} from "@nvdunginest/emis-mui";

import {
  useTypedSelector,
  AppDispatch,
  alertActions,
  loadingActions,
} from "../../../../core";

import { ContractDetailContext } from "../../stores/ContractDetailStore";
import { CreateRequestModel, StepModel } from "../../services/request";
import userService from "../../services/user";

type StepState = {
  userNumber: string;
  fullName: string;
};

export default function CreateRequest(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const { state, create } = React.useContext(ContractDetailContext);
  const currentUser = useTypedSelector((state) => state.auth.user);
  const { contract } = state;

  const [content, setContent] = React.useState("");
  const [keyWord, setKeyWord] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [checkers, setCheckers] = React.useState<StepState[]>([]);
  const [approver, setApprover] = React.useState<StepState>({
    fullName: "",
    userNumber: "",
  });

  const handleOpen = () => {
    setContent("");
    setCheckers([]);
    setApprover({ fullName: "", userNumber: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddApprover = async () => {
    dispatch(loadingActions.show());
    try {
      const approver = await userService.getApproverByKeyWord(keyWord);
      setApprover({
        fullName: approver.fullName,
        userNumber: approver.userNumber,
      });
    } catch {
      dispatch(
        alertActions.show(
          "Không tìm thấy người này trong danh sách phê duyệt!",
          "error"
        )
      );
    } finally {
      dispatch(loadingActions.hide());
    }
  };

  const handleAddChecker = async () => {
    dispatch(loadingActions.show());
    try {
      const checker = await userService.getApproverByKeyWord(keyWord);
      if (
        !checkers
          .map((checker) => checker.userNumber)
          .includes(checker.userNumber)
      ) {
        setCheckers([
          ...checkers,
          { fullName: checker.fullName, userNumber: checker.userNumber },
        ]);
      }
    } catch {
      dispatch(
        alertActions.show(
          "Không tìm thấy người này trong danh sách phê duyệt!",
          "error"
        )
      );
    } finally {
      dispatch(loadingActions.hide());
    }
  };

  const handleRemoveChecker = (userNumber: string) => {
    setCheckers(
      checkers.filter((checker) => checker.userNumber !== userNumber)
    );
  };

  const handleSubmit = async () => {
    if (
      checkers.find((x) => x.userNumber === approver.userNumber) !== undefined
    ) {
      dispatch(
        alertActions.show(
          "Người phê duyệt không thể đồng thời là người kiểm tra!",
          "error"
        )
      );
    } else {
      setOpen(false);
      const steps: StepModel[] = [
        ...checkers.map((checker) => ({
          userNumber: checker.userNumber,
          isFinish: false,
        })),
        { userNumber: approver.userNumber, isFinish: true },
      ];

      const model: CreateRequestModel = {
        isReopen: contract.status === "A",
        content: content,
        steps: steps,
      };

      create(contract.contractNumber, model);
    }
  };

  const checkPermission = (): boolean => {
    if (currentUser === null) {
      return false;
    }

    if (contract.createdBy !== currentUser.employeeId) {
      return false;
    }
    if (contract.status !== "P" && contract.status !== "A") {
      return false;
    }

    return true;
  };

  return checkPermission() ? (
    <Grid item>
      <FormDialog
        title={
          contract.status === "P" ? "Tạo yêu cầu phê duyệt" : "Mở lại hợp đồng"
        }
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
              onChange={(event) => {
                setKeyWord(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} container spacing={1}>
            <Grid item>
              <IconButton
                text="Kiểm tra"
                color="primary"
                icon="check-circle"
                variant="contained"
                onClick={handleAddChecker}
              />
            </Grid>
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
              <Typography variant="caption">Người kiểm tra:</Typography>
              <div>
                {checkers.map((checker) => (
                  <Chip
                    style={{ margin: "4px" }}
                    key={checker.userNumber}
                    label={`${checker.userNumber}-${checker.fullName}`}
                    onDelete={() => {
                      handleRemoveChecker(checker.userNumber);
                    }}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption">Người phê duyệt:</Typography>
              <div>
                {approver.userNumber !== "" && (
                  <Chip
                    style={{ margin: "4px" }}
                    label={`${approver.userNumber}-${approver.fullName}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}
              </div>
            </Grid>
          </Grid>
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
        color={contract.status === "P" ? "primary" : "info"}
        tooltip={
          contract.status === "P" ? "Tạo yêu cầu phê duyệt" : "Mở lại hợp đồng"
        }
        icon={contract.status === "P" ? "play-circle" : "sync-alt"}
        text={contract.status === "P" ? "Tạo yêu cầu" : "Mở lại"}
        onClick={handleOpen}
      />
    </Grid>
  ) : (
    <></>
  );
}
