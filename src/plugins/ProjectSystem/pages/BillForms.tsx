import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Grid,
	Typography,
	colors,
} from '@material-ui/core';
import {
	FormDialog,
	TextField,
	IconButton,
	UploadButton,
	DownloadButton,
} from '@nvdunginest/emis-mui';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import ProjectComboBox from '../components/ProjectsComboBox';

import {
	ProjectModel,
} from '../services/project';

import billFormService, {
	BillFormModel,
} from '../services/billForm';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%',
	},
	container: {
		maxHeight: 'calc(100% - 120px)',
		overflowY: 'scroll',
	},
	cell: {
		fontSize: '0.75rem',
	},
});

type State = {
	billFormCode: string;
	projectCode: string;
	billFormName: string;
	beginRow: string;
	endRow: string;
	billCodeCol: string;
	totalCol: string;
	previousCol: string;
	actualCol: string;
	fileName: string;
}

const initialState: State = {
	billFormCode: '',
	projectCode: '',
	billFormName: '',
	beginRow: '0',
	endRow: '0',
	billCodeCol: '0',
	totalCol: '0',
	previousCol: '0',
	actualCol: '0',
	fileName: '',
}

export default function BillForms(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();
	const [showForm, setShowForm] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);

	const [selectedProject, setSelectedProject] = React.useState<ProjectModel | null>(null);

	const [billForms, setBillForms] = React.useState<BillFormModel[]>([]);
	const [item, setItem] = React.useState<State>(initialState);

	const [removeItem, setRemoveItem] = React.useState<string>('');

	const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

	const handleSubmitDelete = async () => {
		setShowConfirmDelete(false);
		if (selectedProject !== null) {
			dispatch(loadingActions.show());
			try {
				await billFormService.remove(selectedProject.code, removeItem);
				handleRefresh();
				setRemoveItem('');
				dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			}
			catch {
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	}

	const handleSubmitUploadForm = async (billFormCode: string, files: File[]) => {
		if (files.length >= 1 && selectedProject !== null) {
			dispatch(loadingActions.show());
			try {
				await billFormService.attach(selectedProject.code, billFormCode, files[0]);
				dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
				handleRefresh();
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

	const handleOpenEditForm = (item: BillFormModel) => {
		setItem({
			actualCol: item.actualCol.toString(),
			beginRow: item.beginRow.toString(),
			billCodeCol: item.billCodeCol.toString(),
			billFormCode: item.billFormCode,
			billFormName: item.billFormName,
			endRow: item.endRow.toString(),
			fileName: '',
			previousCol: item.previousCol.toString(),
			projectCode: item.projectCode,
			totalCol: item.totalCol.toString(),
		});
		setIsEdit(true);
		setShowForm(true);
	};

	const handleSubmit = async () => {
		setShowForm(false);
		if (selectedProject !== null) {
			dispatch(loadingActions.show());
			const model: BillFormModel = {
				actualCol: parseInt(item.actualCol),
				beginRow: parseInt(item.beginRow),
				billCodeCol: parseInt(item.billCodeCol),
				billFormCode: item.billFormCode,
				billFormName: item.billFormName,
				endRow: parseInt(item.endRow),
				fileName: '',
				previousCol: parseInt(item.previousCol),
				projectCode: selectedProject.code,
				totalCol: parseInt(item.totalCol),
			}
			try {
				if (isEdit) {
					await billFormService.edit(selectedProject.code, model);
				}
				else {
					await billFormService.create(selectedProject.code, model);
				}
				dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
				handleRefresh();
			}
			catch {
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	};

	const handleProjectChange = (value: ProjectModel) => {
		setSelectedProject(value);
	}

	const handleRefresh = async () => {
		dispatch(loadingActions.show());
		if (selectedProject !== null) {
			try {
				setBillForms(await billFormService.getAll(selectedProject.code));
			}
			catch {
				setBillForms([]);
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
		}
		else {
			setBillForms([]);
		}
		dispatch(loadingActions.hide());
	}

	React.useEffect(() => {
		handleRefresh();
		setRemoveItem('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedProject]);

	return (
		<>
			<FormDialog
				open={showConfirmDelete}
				onClose={() => { setShowConfirmDelete(false) }}
				onSubmit={() => { handleSubmitDelete(); }}
				title="Xác nhận xóa biểu mẫu"
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Typography variant="body2">
							Thao tác này sẽ xóa biểu mẫu được chọn. Vui lòng kiểm tra kỹ các điển hình trước khi xóa!
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">{removeItem}</Typography>
					</Grid>
				</Grid>
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
							name="billFormCode"
							label="Mã biểu mẫu"
							type="text"
							required
							disabled={isEdit}
							value={item.billFormCode}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="billFormName"
							label="Tên biểu mẫu"
							type="text"
							required
							value={item.billFormName}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="beginRow"
							label="Hàng bắt đầu"
							type="number"
							required
							value={item.beginRow}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="endRow"
							label="Hàng kết thúc"
							type="number"
							required
							value={item.endRow}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="billCodeCol"
							label="Cột mã BOQ"
							type="number"
							required
							value={item.billCodeCol}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="totalCol"
							label="Cột tổng BOQ"
							type="number"
							required
							value={item.totalCol}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="previousCol"
							label="Cột lũy kế kỳ trước"
							type="number"
							required
							value={item.previousCol}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="actualCol"
							label="Cột kỳ này"
							type="number"
							required
							value={item.actualCol}
							onChange={handleChange}
						/>
					</Grid>
				</Grid>
			</FormDialog>
			<Paper className={classes.root}>
				<Grid container>
					<Grid
						container
						item xs={12}
						style={{ padding: '8px' }}
						direction="row"
						spacing={1}
						alignItems="flex-end"
					>
						<Grid item xs={12}>
							<ProjectComboBox
								value={selectedProject}
								onChange={handleProjectChange}
							/>
						</Grid>
						{selectedProject !== null && (
							<Grid container spacing={1} item xs={12} alignItems="flex-end">
								<Grid item>
									<IconButton
										tooltip="Thêm mới"
										variant="contained"
										text="Thêm"
										icon="plus"
										color="primary"
										onClick={handleOpenCreateForm}
									/>
								</Grid>
								{/* <Grid item>
									<UploadButton
										filesLimit={1}
										title="Tải tệp excel"
										acceptedFiles={['.xls', '.xlsx',]}
										onSubmit={handleSubmitUploadForm}
										tooltip="Tạo từ file excel"
										variant="contained"
										text="Upload Excel"
										color="primary"
									/>
								</Grid> */}
								{/* <Grid item>
									<DownloadButton
										variant="contained"
										label="Tải về"
										filename={`${selectedProject.code}_Dien hinh.xlsx`}
										url={`/api/project-system/clusters/get-excel?projectCode=${selectedProject.code}&version=${versionNumberEnum.PACK}`}
									/>
								</Grid> */}
								<Grid item>
									<IconButton
										tooltip="Làm mới"
										variant="contained"
										text="Làm mới"
										color="success"
										icon="sync-alt"
										onClick={handleRefresh}
									/>
								</Grid>
								{/* <Grid item>
									<IconButton
										tooltip="Xóa các điển hình đã chọn"
										variant="contained"
										text="Xóa"
										color="danger"
										icon="trash-alt"
										disabled={removeItem.length <= 0}
										onClick={() => { setShowConfirmDelete(true); }}
									/>
								</Grid> */}
							</Grid>
						)}
					</Grid>
				</Grid>
				<TableContainer className={classes.container}>
					<Table stickyHeader aria-label="sticky table" size="small">
						<TableHead>
							<TableRow>
								<TableCell style={{ padding: 0, width: 16 }}></TableCell>
								<TableCell className={classes.cell} align="left">Mã biểu mẫu</TableCell>
								<TableCell className={classes.cell} align="left">Tên biểu mẫu</TableCell>
								<TableCell className={classes.cell} align="left">Hàng BĐ</TableCell>
								<TableCell className={classes.cell} align="left">Hàng KT</TableCell>
								<TableCell className={classes.cell} align="left">Cột BOQ</TableCell>
								<TableCell className={classes.cell} align="left">Cột tổng</TableCell>
								<TableCell className={classes.cell} align="left">Cột LKKT</TableCell>
								<TableCell className={classes.cell} align="left">Cột THKN</TableCell>
								<TableCell className={classes.cell} align="left">File biểu mẫu</TableCell>
								<TableCell className={classes.cell} align="left"></TableCell>
								<TableCell className={classes.cell} align="left"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{billForms.map(b => (
								<TableRow key={b.billFormCode}>
									<TableCell
										style={{
											padding: 0,
											width: 16,
											backgroundColor: colors.teal[100],
										}}
										onClick={() => {
											setRemoveItem(b.billFormCode);
											setShowConfirmDelete(true);
										}}
									>
									</TableCell>
									<TableCell
										className={classes.cell}
										align="left"
										style={{
											cursor: 'pointer',
										}}
										onClick={() => {
											handleOpenEditForm(b);
										}}
									>
										{b.billFormCode}
									</TableCell>
									<TableCell className={classes.cell} align="left">{b.billFormName}</TableCell>
									<TableCell className={classes.cell} align="left">{b.beginRow}</TableCell>
									<TableCell className={classes.cell} align="left">{b.endRow}</TableCell>
									<TableCell className={classes.cell} align="left">{b.billCodeCol}</TableCell>
									<TableCell className={classes.cell} align="left">{b.totalCol}</TableCell>
									<TableCell className={classes.cell} align="left">{b.previousCol}</TableCell>
									<TableCell className={classes.cell} align="left">{b.actualCol}</TableCell>
									<TableCell className={classes.cell} align="left">{b.fileName}</TableCell>
									<TableCell className={classes.cell} align="left">
										<UploadButton
											filesLimit={1}
											title="Attach"
											acceptedFiles={['.xls', '.xlsx',]}
											onSubmit={(file) => { handleSubmitUploadForm(b.billFormCode, file); }}
											tooltip="Tạo từ file excel"
											text="Attach"
											variant="text"
											color="primary"
										/>
									</TableCell>
									<TableCell className={classes.cell} align="left">
										{b.fileName !== '' && selectedProject !== null && (
											<DownloadButton
												variant="text"
												label="Tải về"
												filename={b.fileName}
												url={`/api/project-system/billForms/get-excel?projectCode=${selectedProject.code}&billFormCode=${b.billFormCode}`}
											/>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</>
	);
}
