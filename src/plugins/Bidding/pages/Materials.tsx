import React from 'react';
import { useDispatch } from 'react-redux';
import { DropzoneArea } from 'material-ui-dropzone';
import { Grid, Typography } from '@material-ui/core';
import {
	IconButton,
	FormDialog,
	TextField,
	DataTable,
	DataColumnType,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import materialService, { MaterialModel, AddFromExcelModel } from '../services/material';

type Data = MaterialModel & {
	action: JSX.Element,
}

const columns: DataColumnType<Data>[] = [
	{ id: 'code', label: 'Mã', numeric: false, sortable: true },
	{ id: 'description', label: 'Diễn giải', numeric: false, sortable: false },
	{ id: 'unit', label: 'Đơn vị', numeric: false, sortable: false },
	{ id: 'optionUnit', label: 'Đơn vị 2', numeric: false, sortable: false },
	{ id: 'action', label: '', numeric: false, sortable: false },
];

const initialState: MaterialModel = {
	code: '',
	description: '',
	unit: '',
	optionUnit: '',
}

export default function Materials(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [showForm, setShowForm] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);

	const [materials, setMaterials] = React.useState<MaterialModel[]>([]);
	const [item, setItem] = React.useState<MaterialModel>(initialState);

	const [showUploadForm, setShowUploadForm] = React.useState(false);
	const [file, setFile] = React.useState<File | undefined>();
	const [showAddExcelResult, setShowAddExcelResult] = React.useState(false);
	const [addExcelResult, setAddExcelResult] = React.useState<AddFromExcelModel[]>([]);

	const handleCloseUploadForm = () => {
		setShowUploadForm(false);
	};

	const handleOpenUploadForm = () => {
		setShowUploadForm(true);
	};

	const handleCloseExcelResult = () => {
		setShowAddExcelResult(false);
	};

	const handleChangeFile = (files: File[]) => {
		if (Array.isArray(files)) {
			setFile(files[0]);
		}
	};

	const handleSubmitUploadForm = async () => {
		if (file !== undefined) {
			setShowUploadForm(false);
			setAddExcelResult([]);
			dispatch(loadingActions.show());
			try {
				setAddExcelResult(await materialService.addFromExcel(file));
				refresh();
				setShowAddExcelResult(true);
			}
			catch {
				dispatch(loadingActions.hide());
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
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
		setItem(initialState);
		setIsEdit(false);
		setShowForm(true);
	};

	const handleOpenEditForm = (item: MaterialModel) => {
		setItem(item);
		setIsEdit(true);
		setShowForm(true);
	};

	const handleSubmit = async () => {
		setShowForm(false);
		dispatch(loadingActions.show());
		try {
			if (isEdit) {
				await materialService.edit(item.code, item);
			}
			else {
				await materialService.create(item);
			}
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	};

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

	const renderData = (data: MaterialModel[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
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
						/>
					</>
				)
			}

			return row;
		});
	}

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setMaterials(await materialService.getAll());
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
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
		<>
			<FormDialog
				open={showAddExcelResult}
				onClose={handleCloseExcelResult}
				title="Kết quả tạo từ file excel"
				onSubmit={handleCloseExcelResult}
			>
				<Grid container spacing={1}>
					{addExcelResult.map((a, index) => (
						<Grid item container spacing={1} xs={12} key={index}>
							<Grid item xs={12} md={3} style={{ color: a.isAdded ? 'green' : 'red' }}>
								<Typography variant="subtitle2">{a.code}</Typography>
							</Grid>
							{!a.isAdded && <Grid item xs={12} md={9} style={{ color: a.isAdded ? 'green' : 'red' }}>
								<Typography variant="caption">{a.message}</Typography>
							</Grid>}
						</Grid>
					))}
				</Grid>
			</FormDialog>
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
							name="code"
							label="Mã"
							type="text"
							required
							value={item.code}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="description"
							label="Diễn giải"
							type="text"
							required
							value={item.description}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="unit"
							label="Đơn vị"
							type="text"
							required
							value={item.unit}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="optionUnit"
							label="Đơn vị 2"
							type="text"
							required
							value={item.optionUnit}
							onChange={handleChange}
						/>
					</Grid>
				</Grid>
			</FormDialog>
			<DataTable
				title="Material/Service master"
				columns={columns}
				data={renderData(materials)}
				actions={actionsButton}
				initialOrderBy="code"
			/>
		</>
	)
}
