import React from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { Grid } from "@material-ui/core";
import { IconButton, FormDialog } from "@nvdunginest/emis-mui";

import { useTypedSelector } from "../../../../core";

import { ContractDetailContext } from "../../stores/ContractDetailStore";

export default function Attachment(): JSX.Element {
  const { state, createAttachment } = React.useContext(ContractDetailContext);
  const currentUser = useTypedSelector((state) => state.auth.user);
  const { contract } = state;
  const [files, setFiles] = React.useState<File[]>([]);
  const [privateFiles, setPrivateFiles] = React.useState<File[]>([]);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setOpen(false);
    createAttachment(contract.contractNumber, files, privateFiles);
  };

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

  return checkPermission() ? (
    <Grid item>
      <FormDialog
        title="Tải lên tài liệu đính kèm"
        onClose={handleClose}
        open={open}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={1} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <DropzoneArea
              showPreviews={false}
              showFileNames
              filesLimit={10}
              maxFileSize={25000000}
              useChipsForPreview
              dropzoneText="Tải lên tài liệu public"
              onChange={(files) => {
                setFiles(files);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DropzoneArea
              showPreviews={false}
              showFileNames
              filesLimit={10}
              maxFileSize={25000000}
              useChipsForPreview
              dropzoneText="Tải lên tài liệu private"
              onChange={(files) => {
                setPrivateFiles(files);
              }}
            />
          </Grid>
        </Grid>
      </FormDialog>
      <IconButton
        variant="contained"
        color="dark"
        tooltip="Đính kèm tài liệu"
        icon="paperclip"
        text="Đính kèm"
        onClick={handleOpen}
      />
    </Grid>
  ) : (
    <></>
  );
}
