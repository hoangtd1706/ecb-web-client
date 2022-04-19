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
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import format from '../../../configs/format';

import ProjectsComboBox from '../components/ProjectsComboBox';
import MaterialsComboBox from '../components/MaterialsComboBox';

import {
	versionNumberEnum,
	AddFromExcelModel,
} from '../services/common';

import {
	ProjectModel,
} from '../services/project';

import itemService, {
	ItemViewModel,
} from '../services/item';

import {
	MaterialModel,
} from '../services/material';

import resourceService, {
	ResourceViewModel,
	ResourceModel,
	ResourceRemoveModel,
} from '../services/resource';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%',
	},
	container: {
		maxHeight: 'calc(100% - 130px)',
		overflowY: 'scroll',
	},
	cell: {
		fontSize: '0.75rem',
	},
});

type ResourceState = {
	serviceMasterCode: string,
	materialCode: string,
	quantity: string,
}

const initialState: ResourceState = {
	serviceMasterCode: '',
	materialCode: '',
	quantity: '',
}

const isInclude = (serviceMasterCode: string, materialCode: string, data: ResourceRemoveModel[]): boolean => {
	return data.find(x => x.materialCode === materialCode && x.serviceMasterCode === serviceMasterCode) !== undefined;
}

export default function Resources(): JSX.Element {
	const classes = useStyles();

	const dispatch: AppDispatch = useDispatch();
	const [showForm, setShowForm] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);

	const [project, setProject] = React.useState<ProjectModel | null>(null);
	const [material, setMaterial] = React.useState<MaterialModel | null>(null);

	const [items, setItems] = React.useState<ItemViewModel[]>([]);
	const [resources, setResources] = React.useState<ResourceViewModel[]>([]);
	const [model, setModel] = React.useState<ResourceState>(initialState);

	const [selectedList, setSelectedList] = React.useState<ResourceRemoveModel[]>([]);

	const [showAddExcelResult, setShowAddExcelResult] = React.useState(false);
	const [addExcelResult, setAddExcelResult] = React.useState<AddFromExcelModel<ResourceModel>[]>([]);

	const [keyWord, setKeyWord] = React.useState<string>('');

	const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

	const handleSubmitDelete = async () => {
		setShowConfirmDelete(false);
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				await resourceService.remove(project.code, selectedList);
				fetchResources()
				setSelectedList([]);
				dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			}
			catch {
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	}

	const handleCloseExcelResult = () => {
		setShowAddExcelResult(false);
	};

	const handleSubmitUploadForm = async (files: File[]) => {
		if (files.length >= 1 && project !== null) {
			setAddExcelResult([]);
			dispatch(loadingActions.show());
			try {
				setAddExcelResult(await resourceService.addFromExcel(project.code, files[0]));
				handleRefresh();
				setShowAddExcelResult(true);
			}
			catch {
				dispatch(loadingActions.hide());
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			}
		}
	};

	const fetchResources = async () => {
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				setResources(await resourceService.getAll(project.code, versionNumberEnum.PACK));
			}
			catch {
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
			finally {
				dispatch(loadingActions.hide());
			}
		}
	}

	const handleRefresh = async () => {
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				const data = await Promise.all([
					itemService.getDistinct(project.code, versionNumberEnum.POST),
					resourceService.getAll(project.code, versionNumberEnum.PACK),
				]);
				setItems(data[0]);
				setResources(data[1]);
			}
			catch {
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
			finally {
				dispatch(loadingActions.hide());
			}
		}
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setModel({ ...model, [event.target.name]: event.target.value });
	};

	const handleCloseForm = () => {
		setShowForm(false);
	};

	const handleOpenCreateForm = (serviceMasterCode: string) => {
		setModel({
			serviceMasterCode: serviceMasterCode,
			materialCode: '',
			quantity: '0',
		});
		setIsEdit(false);
		setShowForm(true);
	};

	const handleOpenEditForm = (item: ResourceViewModel) => {
		setModel({
			serviceMasterCode: item.serviceMasterCode,
			materialCode: item.materialCode,
			quantity: item.quantity.toString(),
		});
		setIsEdit(true);
		setShowForm(true);
	};

	const handleSubmit = async () => {
		setShowForm(false);
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				if (isEdit) {
					const data: ResourceModel = {
						serviceMasterCode: model.serviceMasterCode,
						materialCode: model.materialCode,
						quantity: parseFloat(model.quantity),
						projectCode: project.code,
						versionNumber: versionNumberEnum.PACK,
					}
					await resourceService.edit(project.code, model.serviceMasterCode, model.materialCode, data);
					dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
					fetchResources();
				}
				else {
					if (material !== null) {
						const data: ResourceModel = {
							serviceMasterCode: model.serviceMasterCode,
							materialCode: material.code,
							quantity: parseFloat(model.quantity),
							projectCode: project.code,
							versionNumber: versionNumberEnum.PACK,
						}
						await resourceService.create(project.code, data);
						dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
						fetchResources();
					}
				}
			}
			catch {
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	};

	const handleSelect = async (serviceMasterCode: string, materialCode: string) => {
		if (isInclude(serviceMasterCode, materialCode, selectedList)) {
			setSelectedList(selectedList.filter(x => !(x.materialCode === materialCode && x.serviceMasterCode === serviceMasterCode)));
		}
		else {
			setSelectedList([...selectedList, { materialCode, serviceMasterCode }]);
		}
	}

	React.useEffect(() => {
		handleRefresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	React.useEffect(() => {
		setSelectedList([]);
	}, [resources]);

	return (
		<>
			<FormDialog
				open={showConfirmDelete}
				onClose={() => { setShowConfirmDelete(false) }}
				onSubmit={() => { handleSubmitDelete(); }}
				title="Xác nhận xóa các định mức"
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Typography variant="body2">
							Thao tác này sẽ xóa các định mức được chọn. Vui lòng kiểm tra kỹ trước khi xóa!
						</Typography>
					</Grid>
					{selectedList.map((s, i) => (
						<Grid item xs={12} key={i}>
							<Typography variant="subtitle2">{`${s.serviceMasterCode} - ${s.materialCode}`}</Typography>
						</Grid>
					))}
				</Grid>
			</FormDialog>
			<FormDialog
				open={showAddExcelResult}
				onClose={handleCloseExcelResult}
				title="Kết quả tạo từ file excel"
			>
				<Grid container spacing={1}>
					{addExcelResult.map((a, index) => (
						<Grid item container spacing={1} xs={12} key={index}>
							<Grid item xs={12} md={3} style={{ color: a.isAdded ? 'green' : 'red' }}>
								<Typography variant="subtitle2">{`${a.item.serviceMasterCode}-${a.item.materialCode}`}</Typography>
							</Grid>
							<Grid item xs={12} md={9} style={{ color: a.isAdded ? 'green' : 'red' }}>
								<Typography variant="caption">{a.message}</Typography>
							</Grid>
						</Grid>
					))}
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
							name="serviceMasterCode"
							label="Mã công tác"
							type="text"
							required
							disabled
							value={model.serviceMasterCode}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						{isEdit ?
							<TextField
								name="materialCode"
								label="Mã vật tư"
								type="text"
								required
								disabled
								value={model.materialCode}
								onChange={handleChange}
							/>
							:
							<MaterialsComboBox
								value={material}
								onChange={(value) => { setMaterial(value) }}
							/>
						}
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="quantity"
							label="Số lượng"
							type="number"
							required
							value={model.quantity}
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
						<Grid item xs={12} md={6}>
							<ProjectsComboBox
								value={project}
								onChange={(value) => { setProject(value) }}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								name="keyWord"
								label="Lọc theo công tác"
								type="text"
								value={keyWord}
								onChange={(event) => { setKeyWord(event.target.value); }}
							/>
						</Grid>
						{project !== null && (
							<Grid container spacing={1} item xs={12} alignItems="flex-end">
								<Grid item>
									<UploadButton
										filesLimit={1}
										title="Tải tệp excel"
										acceptedFiles={['.xls', '.xlsx',]}
										onSubmit={handleSubmitUploadForm}
										tooltip="Tạo từ file excel"
										variant="contained"
										text="Excel"
										color="primary"
									/>
								</Grid>
								<Grid item>
									<DownloadButton
										variant="contained"
										label="Tải về"
										filename={`${project.code}_Dinh muc.xlsx`}
										url={`/api/project-system/resources/get-excel?projectCode=${project.code}&version=${versionNumberEnum.PACK}`}
									/>
								</Grid>
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
								<Grid item>
									<IconButton
										tooltip="Xóa các định mức đã chọn"
										variant="contained"
										text="Xóa"
										color="danger"
										icon="trash-alt"
										disabled={selectedList.length <= 0}
										onClick={() => { setShowConfirmDelete(true); }}
									/>
								</Grid>
							</Grid>
						)}
					</Grid>
				</Grid>
				<TableContainer className={classes.container}>
					<Table stickyHeader aria-label="sticky table" size="small">
						<TableHead>
							<TableRow>
								<TableCell style={{ padding: 0, width: 16 }}></TableCell>
								<TableCell className={classes.cell} align="left">Mã vật tư</TableCell>
								<TableCell className={classes.cell} align="left">Diễn giải</TableCell>
								<TableCell className={classes.cell} align="center">Đơn vị</TableCell>
								<TableCell className={classes.cell} align="right">Định mức</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{items.map(item => (
								<React.Fragment key={item.serviceMasterCode}>
									<TableRow>
										<TableCell style={{ padding: 0, width: 16 }}></TableCell>
										<TableCell className={classes.cell} align="left" style={{ fontWeight: 'bold' }}>{item.serviceMasterCode}</TableCell>
										<TableCell className={classes.cell} align="left" style={{ fontWeight: 'bold' }}>{item.serviceMasterDescription}</TableCell>
										<TableCell className={classes.cell} align="center" style={{ fontWeight: 'bold' }}>{item.serviceMasterUnit}</TableCell>
										<TableCell className={classes.cell} align="right"></TableCell>
									</TableRow>
									{resources.filter(x => x.serviceMasterCode === item.serviceMasterCode).map((r, index) => (
										<TableRow key={index}
											style={{
												backgroundColor: isInclude(r.serviceMasterCode, r.materialCode, selectedList) ? colors.red[100] : 'initial',
											}}
										>
											<TableCell
												style={{
													padding: 0,
													width: 16,
													backgroundColor: isInclude(r.serviceMasterCode, r.materialCode, selectedList) ? colors.red[500] : colors.teal[100],
												}}
												onClick={() => { handleSelect(r.serviceMasterCode, r.materialCode) }}
											>
											</TableCell>
											<TableCell
												className={classes.cell}
												align="left"
												style={{ paddingLeft: '32px', cursor: 'pointer', }}
												onClick={() => {
													handleOpenEditForm(r);
												}}
											>
												{r.materialCode}
											</TableCell>
											<TableCell className={classes.cell} align="left" style={{ paddingLeft: '32px' }}>{r.materialDescription}</TableCell>
											<TableCell className={classes.cell} align="center">{r.materialUnit}</TableCell>
											<TableCell className={classes.cell} align="right">{format.formatMoney(r.quantity, 3)}</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell style={{ padding: 0, width: 16, backgroundColor: colors.green[300] }}></TableCell>
										<TableCell
											className={classes.cell}
											colSpan={4}
											align="left"
											style={{ cursor: 'pointer', fontStyle: 'italic' }}
											onClick={() => handleOpenCreateForm(item.serviceMasterCode)}
										>
											+ Thêm định mức mới
										</TableCell>
									</TableRow>
								</React.Fragment>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</>
	);
}
