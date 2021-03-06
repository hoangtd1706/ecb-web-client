import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Typography,
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import {
  Frame,
  TextField,
  DateTimePicker,
  Editor,
  Checkbox,
  IconButton,
  ComboBox,
} from '@nvdunginest/emis-mui';

import {
  AppDispatch,
  alertActions,
  alertMessage,
  loadingActions,
} from '../../../../core';

import { CreatePackageContext } from '../../stores/CreatePackageStore';
import packageService from '../../services/package';
import { VendorModel } from '../../services/vendor';

type VendorComboBoxType = VendorModel & {
  label: string;
}

export default function Header(): JSX.Element {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();

  const { state, changeHeader, changeVendors, changeFiles } = React.useContext(CreatePackageContext);
  const { model, vendors } = state;
  const [selectedVendor, setSelectedVendor] = React.useState<VendorComboBoxType | null>(null);

  const handleChangeFile = (files: File[]) => {
    if (Array.isArray(files)) {
      changeFiles(files);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeHeader(event.target.name, event.target.value);
  }

  const handleChangeDate = (name: string, value: Date) => {
    changeHeader(name, value);
  }

  const handleCreatePackage = async () => {
    dispatch(loadingActions.show());
    try {
      const packageCode = await packageService.createPackage(state.model);
      dispatch(alertActions.show(`${alertMessage.ACTION_SUCCESS}`, 'success'));
      history.push(`/bidding/expert/package/${packageCode}`)
    }
    catch {
      dispatch(alertActions.show(`${alertMessage.ACTION_FAILURE}`, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  const handleAddVendor = () => {
    if (selectedVendor !== null) {
      if (!model.vendors.map(x => x.code).includes(selectedVendor.code)) {
        changeVendors(selectedVendor.code, true);
      }
    }
  }

  const handleRemoveVendor = (vendorCode: string) => {
    changeVendors(vendorCode, false);
  }

  const renderComboBoxOptions = (vendors: VendorModel[]): VendorComboBoxType[] => {
    return vendors.map(x => {
      const result: VendorComboBoxType = {
        ...x,
        label: `[${x.code}]-${x.longTextName}`,
      }

      return result;
    })
  }

  return (
    <Frame title="Th??ng tin chung">
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            label="M?? s???"
            name="code"
            type="text"
            value={state.model.code}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            label="T??n g??i th???u"
            name="name"
            type="text"
            value={state.model.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">Lo???i h??nh g??i th???u</Typography>
          <div>
            <Checkbox
              checked={model.isInternal}
              name="isInternal"
              label="?????u th???u n???i b???"
              onChange={(_event, checked) => {
                changeHeader('isInternal', checked);
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Th???i gian m??? th???u"
            name="begin"
            value={state.model.begin}
            onChange={(date) => { handleChangeDate('begin', date as Date); }}
            disablePast
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Th???i gian ????ng th???u"
            name="end"
            value={state.model.end}
            onChange={(date) => { handleChangeDate('end', date as Date); }}
            disablePast
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">N???i dung</Typography>
          <Editor
            value={state.model.description}
            onChange={(content: string) => { changeHeader('description', content) }}
          />
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid container item xs={12} spacing={1} alignItems="flex-end">
            <Grid item xs={10}>
              <ComboBox
                label="Ch???n nh?? cung c???p"
                optionLabel="label"
                value={selectedVendor}
                options={renderComboBoxOptions(vendors)}
                getOptionSelected={(o, v) => o.code === v.code}
                onChange={(value) => { setSelectedVendor(value); }}
              />
            </Grid>
            <Grid item>
              <IconButton
                icon="plus"
                color="primary"
                text="Th??m"
                variant="contained"
                onClick={() => { handleAddVendor(); }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={1}>
            {model.vendors.map((vendor, index) => (
              <Grid key={vendor.code} item container spacing={1} xs={12}>
                <Grid item>
                  <Typography variant="subtitle2">
                    {`${index + 1}. [${vendor.code}] - ${vendor.longTextName}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    icon="trash-alt"
                    color="danger"
                    text="X??a"
                    onClick={() => { handleRemoveVendor(vendor.code); }}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">T??i li???u ????nh k??m</Typography>
          <div>
            <Grid container spacing={1}>
              <DropzoneArea
                showPreviews={false}
                acceptedFiles={[
                  '.doc',
                  '.docx',
                  '.xls',
                  '.xlsx',
                  '.pdf',
                  '.rar',
                  '.zip',
                ]}
                showFileNames
                filesLimit={10}
                maxFileSize={25000000}
                useChipsForPreview
                dropzoneText="K??o th??? file v??o ????y ????? t???i l??n"
                onChange={handleChangeFile}
                showAlerts={false}
              />
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <IconButton
            icon="plus"
            color="success"
            text="T???o g??i th???u"
            variant="contained"
            onClick={() => { handleCreatePackage(); }}
          />
        </Grid>
      </Grid>
    </Frame>
  )
}