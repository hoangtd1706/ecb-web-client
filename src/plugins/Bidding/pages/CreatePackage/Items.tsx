import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  Typography,
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import {
  FormDialog,
  TextField,
  IconButton,
  DatePicker,
  DataTable,
  DataColumnType,
  ComboBox,
} from '@nvdunginest/emis-mui';

import {
  AppDispatch,
  alertActions,
  alertMessage,
  loadingActions,
} from '../../../../core';

import format from '../../../../configs/format';

import { CreateItemModel } from '../../services/package';
import { MaterialModel } from '../../services/material';
import { CreatePackageContext } from '../../stores/CreatePackageStore';
import excelReader, { ExcelColumnType } from '../../../../configs/excelReader';

type MaterialComboBoxType = MaterialModel & {
  label: string;
}

type Data = CreateItemModel & {
  noNumber: number,
  infoCol: JSX.Element,
  quantityCol: JSX.Element,
  noteCol: JSX.Element,
  deliveryCol: JSX.Element,
  action: JSX.Element,
}

type ExcelData = {
  no: number;
  code: string;
  spec: string;
  note: string;
  quantity: number;
  optionQuantity: number;
  begin: number;
  end: number;
}

const excelColumns: ExcelColumnType<ExcelData>[] = [
  { name: 'no', col: 0 },
  { name: 'code', col: 1 },
  { name: 'spec', col: 3 },
  { name: 'note', col: 4 },
  { name: 'quantity', col: 6 },
  { name: 'optionQuantity', col: 8 },
  { name: 'begin', col: 9 },
  { name: 'end', col: 10 },
]

const columns: DataColumnType<Data>[] = [
  { id: 'noNumber', label: 'STT', numeric: false, sortable: false },
  { id: 'infoCol', label: 'Hạng mục', numeric: false, sortable: false },
  { id: 'quantityCol', label: 'Số lượng', numeric: false, sortable: false },
  { id: 'noteCol', label: 'Ghi chú', numeric: false, sortable: false },
  { id: 'deliveryCol', label: 'Thời gian giao hàng', numeric: false, sortable: false },
  { id: 'action', label: '', numeric: false, sortable: false },
];

const initialState: CreateItemModel = {
  id: 0,
  no: '0',
  materialCode: '',
  materialDescription: '',
  begin: new Date(),
  end: new Date(),
  note: '',
  optionQuantity: '0',
  optionUnit: '',
  quantity: '0',
  spec: '',
  unit: '',
}

export default function Items(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const { state, addItem, editItem, removeItem } = React.useContext(CreatePackageContext);

  const [item, setItem] = React.useState<CreateItemModel>(initialState);
  const [identity, setIdentity] = React.useState<number>(0);

  const [showForm, setShowForm] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const [showUploadForm, setShowUploadForm] = React.useState(false);
  const [file, setFile] = React.useState<File | undefined>();

  const handleChangeFile = (files: File[]) => {
    if (Array.isArray(files)) {
      setFile(files[0]);
    }
  };

  const handleCloseUploadForm = () => {
    setShowUploadForm(false);
  };

  const handleOpenUploadForm = () => {
    setShowUploadForm(true);
  };

  const handleSubmitUploadForm = async () => {
    if (file !== undefined) {
      setShowUploadForm(false);
      dispatch(loadingActions.show());
      try {
        const excelData = await excelReader.readToArray<ExcelData>(
          file,
          excelColumns,
          1,
          { no: 0, code: '', spec: '', note: '', quantity: 0, optionQuantity: 0, begin: 0, end: 0 }
        );

        excelData.filter(x => x.no > 0).map(row => {
          const material = state.materials.find(x => x.code === row.code);
          if (material !== undefined) {
            const newItem: CreateItemModel = {
              no: row.no.toString(),
              materialCode: row.code,
              spec: row.spec,
              begin: excelReader.excelDateToJSDate(row.begin),
              end: excelReader.excelDateToJSDate(row.end),
              materialDescription: material.description,
              note: row.note,
              unit: material.unit,
              id: identity + 1,
              optionUnit: material.optionUnit,
              quantity: row.quantity.toString(),
              optionQuantity: row.optionQuantity.toString(),
            }

            setIdentity(identity + 1);
            addItem(newItem);
          }
          return true;
        });
        dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
      }
      catch {
        dispatch(alertActions.show('File sai mẫu! Vui lòng kiểm tra lại!', 'error'));
      }
      finally {
        dispatch(loadingActions.hide());
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleOpenCreateForm = () => {
    setItem({ ...initialState, id: identity, no: identity.toString() });
    setIdentity(identity + 1);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleOpenEditForm = (item: CreateItemModel) => {
    setItem(item);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  }

  const handleSubmit = () => {
    setShowForm(false);
    if (isEdit) {
      editItem(item);
    }
    else {
      addItem(item);
    }
  };

  const handleMaterialChange = (value: MaterialComboBoxType | null) => {
    if (value !== null) {
      setItem({
        ...item,
        materialCode: value.code,
        materialDescription: value.description,
        unit: value.unit,
        optionUnit: value.optionUnit
      });
    }
  }

  const actionsButton = [
    <IconButton
      key={1}
      tooltip="Thêm mới"
      text="Thêm"
      icon="plus"
      color="primary"
      onClick={handleOpenCreateForm}
    />,
    <IconButton
      key={2}
      tooltip="Tạo từ file excel"
      text="Excel"
      icon="file-excel"
      color="primary"
      onClick={handleOpenUploadForm}
    />,
  ];

  const renderData = (data: CreateItemModel[]): Data[] => {
    return data.map(item => {
      const row: Data = {
        ...item,
        noNumber: parseInt(item.no, 10),
        infoCol: (
          <div>
            <Typography variant="subtitle2">{item.materialDescription}</Typography>
            <Typography variant="caption">{item.materialCode}</Typography>
          </div>
        ),
        quantityCol: (
          <div>
            <Typography variant="subtitle2">
              {`${format.formatMoney(parseFloat(item.quantity), 3)} ${item.unit}`}
            </Typography>
            <Typography variant="caption">
              {`${format.formatMoney(parseFloat(item.optionQuantity), 3)} ${item.optionUnit}`}
            </Typography>
          </div>
        ),
        noteCol: (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption">{`Spec: ${item.spec}`}</Typography>
            <Typography variant="caption">{`Ghi chú: ${item.note}`}</Typography>
          </div>
        ),
        deliveryCol: (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption">{`Từ: ${format.formatDate(item.begin, 'dd/MM/yyyy')}`}</Typography>
            <Typography variant="caption">{`Đến: ${format.formatDate(item.end, 'dd/MM/yyyy')}`}</Typography>
          </div>
        ),
        action: (
          <>
            <IconButton
              tooltip="Chỉnh sửa"
              text="Sửa"
              icon="edit"
              color="success"
              onClick={() => { handleOpenEditForm(item); }}
            />
            <IconButton
              tooltip="Xóa"
              text="Xóa"
              icon="trash-alt"
              color="danger"
              onClick={() => { handleRemoveItem(item.id); }}
            />
          </>
        ),
      }

      return row;
    });
  }

  const renderComboBoxOptions = (materials: MaterialModel[]): MaterialComboBoxType[] => {
    return materials.map(x => {
      const result: MaterialComboBoxType = {
        ...x,
        label: `[${x.code}]-${x.description}`,
      }

      return result;
    })
  }

  return (
    <>
      <FormDialog
        open={showUploadForm}
        onClose={handleCloseUploadForm}
        title="Tải tệp excel"
        onSubmit={handleSubmitUploadForm}
      >
        <DropzoneArea
          acceptedFiles={[
            '.xls',
            '.xlsx',
          ]}
          showPreviews={false}
          showFileNames
          filesLimit={1}
          maxFileSize={25000000}
          useChipsForPreview
          dropzoneText="Kéo thả file vào đây để tải lên"
          onChange={handleChangeFile}
          showAlerts={false}
        />
      </FormDialog>
      <FormDialog
        title="Thêm/Chỉnh sửa"
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              name="no"
              label="Thứ tự"
              type="text"
              required
              value={item.no}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <ComboBox
              required
              label="Mã vật tư"
              options={renderComboBoxOptions(state.materials)}
              optionLabel="label"
              getOptionSelected={(o, v) => o.code === v.code}
              onChange={handleMaterialChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="materialDescription"
              label="Diễn giải"
              type="text"
              disabled
              required
              value={item.materialDescription}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="spec"
              label="Spec"
              type="text"
              value={item.spec}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="note"
              label="Ghi chú"
              type="text"
              value={item.note}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="quantity"
              label="Số lượng 1"
              type="number"
              value={item.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="unit"
              label="Đơn vị 1"
              type="text"
              disabled
              required
              value={item.unit}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="optionQuantity"
              label="Số lượng 2"
              type="number"
              value={item.optionQuantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="optionUnit"
              label="Đơn vị 2"
              type="text"
              disabled
              required
              value={item.optionUnit}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Ngày bắt đầu giao hàng"
              name="begin"
              value={item.begin}
              onChange={(date) => { setItem({ ...item, begin: date as Date }) }}
              disablePast
              required
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Ngày kết thúc giao hàng"
              name="end"
              value={item.end}
              onChange={(date) => { setItem({ ...item, end: date as Date }) }}
              disablePast
              required
            />
          </Grid>
        </Grid>
      </FormDialog>
      <DataTable
        title="Danh sách vật tư, dịch vụ"
        columns={columns}
        data={renderData(state.model.items)}
        actions={actionsButton}
        initialOrderBy="noNumber"
      />
    </>
  )
}