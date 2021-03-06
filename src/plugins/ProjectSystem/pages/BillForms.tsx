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
				title="X??c nh???n x??a bi???u m???u"
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Typography variant="body2">
							Thao t??c n??y s??? x??a bi???u m???u ???????c ch???n. Vui l??ng ki???m tra k??? c??c ??i???n h??nh tr?????c khi x??a!
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">{removeItem}</Typography>
					</Grid>
				</Grid>
			</FormDialog>
			<FormDialog
				title="Th??m/Ch???nh s???a"
				open={showForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<TextField
							name="billFormCode"
							label="M?? bi???u m???u"
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
							label="T??n bi???u m???u"
							type="text"
							required
							value={item.billFormName}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="beginRow"
							label="H??ng b???t ?????u"
							type="number"
							required
							value={item.beginRow}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="endRow"
							label="H??ng k???t th??c"
							type="number"
							required
							value={item.endRow}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="billCodeCol"
							label="C???t m?? BOQ"
							type="number"
							required
							value={item.billCodeCol}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="totalCol"
							label="C???t t???ng BOQ"
							type="number"
							required
							value={item.totalCol}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="previousCol"
							label="C???t l??y k??? k??? tr?????c"
							type="number"
							required
							value={item.previousCol}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="actualCol"
							label="C???t k??? n??y"
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
										tooltip="Th??m m???i"
										variant="contained"
										text="Th??m"
										icon="plus"
										color="primary"
										onClick={handleOpenCreateForm}
									/>
								</Grid>
								{/* <Grid item>
									<UploadButton
										filesLimit={1}
										title="T???i t???p excel"
										acceptedFiles={['.xls', '.xlsx',]}
										onSubmit={handleSubmitUploadForm}
										tooltip="T???o t??? file excel"
										variant="contained"
										text="Upload Excel"
										color="primary"
									/>
								</Grid> */}
								{/* <Grid item>
									<DownloadButton
										variant="contained"
										label="T???i v???"
										filename={`${selectedProject.code}_Dien hinh.xlsx`}
										url={`/api/project-system/clusters/get-excel?projectCode=${selectedProject.code}&version=${versionNumberEnum.PACK}`}
									/>
								</Grid> */}
								<Grid item>
									<IconButton
										tooltip="L??m m???i"
										variant="contained"
										text="L??m m???i"
										color="success"
										icon="sync-alt"
										onClick={handleRefresh}
									/>
								</Grid>
								{/* <Grid item>
									<IconButton
										tooltip="X??a c??c ??i???n h??nh ???? ch???n"
										variant="contained"
										text="X??a"
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
								<TableCell className={classes.cell} align="left">M?? bi???u m???u</TableCell>
								<TableCell className={classes.cell} align="left">T??n bi???u m???u</TableCell>
								<TableCell className={classes.cell} align="left">H??ng B??</TableCell>
								<TableCell className={classes.cell} align="left">H??ng KT</TableCell>
								<TableCell className={classes.cell} align="left">C???t BOQ</TableCell>
								<TableCell className={classes.cell} align="left">C???t t???ng</TableCell>
								<TableCell className={classes.cell} align="left">C???t LKKT</TableCell>
								<TableCell className={classes.cell} align="left">C???t THKN</TableCell>
								<TableCell className={classes.cell} align="left">File bi???u m???u</TableCell>
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
											tooltip="T???o t??? file excel"
											text="Attach"
											variant="text"
											color="primary"
										/>
									</TableCell>
									<TableCell className={classes.cell} align="left">
										{b.fileName !== '' && selectedProject !== null && (
											<DownloadButton
												variant="text"
												label="T???i v???"
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
