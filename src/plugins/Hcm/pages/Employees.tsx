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
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import employeeService, {
	UserModel,
	AddUserModel,
	AddUserFromExcelModel,
} from '../services/employee';

type Data = UserModel & {
	sortNumber: number,
	action: JSX.Element,
}

const columns: DataColumnType<Data>[] = [
	{ id: 'sortNumber', label: 'Mã số', numeric: false, sortable: true },
	{ id: 'fullName', label: 'Họ tên', numeric: false, sortable: true },
	{ id: 'email', label: 'Email', numeric: false, sortable: false },
	{ id: 'action', label: '', numeric: false, sortable: false },
];

const initialState: AddUserModel = {
	number: '',
	fullName: '',
	email: '',
}

export default function Employees(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [showForm, setShowForm] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);

	const [users, setUsers] = React.useState<UserModel[]>([]);
	const [item, setItem] = React.useState<AddUserModel>(initialState);

	const [showUploadForm, setShowUploadForm] = React.useState(false);
	const [file, setFile] = React.useState<File | undefined>();
	const [showAddExcelResult, setShowAddExcelResult] = React.useState(false);
	const [addExcelResult, setAddExcelResult] = React.useState<AddUserFromExcelModel[]>([]);

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
				setAddExcelResult(await employeeService.addUserFromExcel(file));
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

	const handleLockUser = async (number: string) => {
		dispatch(loadingActions.show());
		try {
			await employeeService.lock(number);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	}

	const handleUnLockUser = async (number: string) => {
		dispatch(loadingActions.show());
		try {
			await employeeService.unLock(number);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	}

	const handleResetUser = async (number: string) => {
		dispatch(loadingActions.show());
		try {
			await employeeService.reset(number);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	}

	const handleSubmit = async () => {
		setShowForm(false);
		dispatch(loadingActions.show());
		try {
			if (isEdit) {
				// await moduleService.edit(item.id, item);
			}
			else {
				await employeeService.create(item);
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
			tooltip="Thêm nhân viên mới"
			text="Thêm"
			icon="plus"
			color="primary"
			hideTitleOnMobile
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

	const renderData = (data: UserModel[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
				sortNumber: parseInt(item.number, 10),
				action: (
					<>
						{item.isActive ? (
							<IconButton
								tooltip="Nhấn vào để khóa"
								text="Đang mở"
								icon="lock-open"
								color="success"
								hideTitleOnMobile
								onClick={() => { handleLockUser(item.number); }}
							/>
						) : (
							<IconButton
								tooltip="Nhấn vào để mở khóa"
								text="Đang khóa"
								icon="lock"
								color="danger"
								hideTitleOnMobile
								onClick={() => { handleUnLockUser(item.number); }}
							/>
						)}
						<IconButton
							tooltip="Đặt lại tài khoản về mặc định"
							text="Đặt lại"
							icon="sync-alt"
							color="primary"
							hideTitleOnMobile
							onClick={() => { handleResetUser(item.number); }}
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
			setUsers(await employeeService.getAll());
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
								<Typography variant="subtitle2">{`${a.number}-${a.fullName}`}</Typography>
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
				title="Thêm/Chỉnh sửa nhân viên"
				open={showForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
			>
				<TextField
					name="number"
					label="Mã số nhân viên"
					type="text"
					required
					value={item.number}
					onChange={handleChange}
				/>
				<TextField
					name="fullName"
					label="Họ và tên"
					type="text"
					required
					value={item.fullName}
					onChange={handleChange}
				/>
				<TextField
					name="email"
					label="Email"
					type="text"
					value={item.email}
					required
					onChange={handleChange}
				/>
			</FormDialog>
			<DataTable
				title="Nhân viên"
				columns={columns}
				data={renderData(users)}
				actions={actionsButton}
				initialOrderBy="sortNumber"
			/>
		</>
	)
}
