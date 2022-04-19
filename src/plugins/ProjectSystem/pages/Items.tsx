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
import ServiceMastersComboBox from '../components/ServiceMastersComboBox';

import {
	versionNumberEnum,
	AddFromExcelModel,
} from '../services/common';

import {
	ProjectModel,
} from '../services/project';

import clusterService, {
	ClusterModel,
} from '../services/cluster';

import {
	ServiceMasterModel,
} from '../services/serviceMaster';

import itemService, {
	ItemViewModel,
	ItemModel,
	ItemRemoveModel,
} from '../services/item';

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

type ItemState = {
	serviceMasterCode: string,
	clusterCode: string,
	billCode: string,
	quantity: string,
}

const initialState: ItemState = {
	serviceMasterCode: '',
	clusterCode: '',
	billCode: '',
	quantity: '',
}

const isInclude = (clusterCode: string, serviceMasterCode: string, data: ItemRemoveModel[]): boolean => {
	return data.find(x => x.clusterCode === clusterCode && x.serviceMasterCode === serviceMasterCode) !== undefined;
}

export default function Items(): JSX.Element {
	const classes = useStyles();

	const dispatch: AppDispatch = useDispatch();
	const [showForm, setShowForm] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);

	const [project, setProject] = React.useState<ProjectModel | null>(null);
	const [serviceMaster, setServiceMaster] = React.useState<ServiceMasterModel | null>(null);

	const [clusters, setClusters] = React.useState<ClusterModel[]>([]);
	const [displayClusters, setDisplayClusters] = React.useState<ClusterModel[]>([]);
	const [items, setItems] = React.useState<ItemViewModel[]>([]);
	const [model, setModel] = React.useState<ItemState>(initialState);

	const [selectedList, setSelectedList] = React.useState<ItemRemoveModel[]>([]);

	const [showAddExcelResult, setShowAddExcelResult] = React.useState(false);
	const [addExcelResult, setAddExcelResult] = React.useState<AddFromExcelModel<ItemModel>[]>([]);

	const [keyWord, setKeyWord] = React.useState<string>('');
	const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

	const handleSubmitDelete = async () => {
		setShowConfirmDelete(false);
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				await itemService.remove(project.code, selectedList);
				fetchItems();
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
				setAddExcelResult(await itemService.addFromExcel(project.code, files[0]));
				fetchItems();
				setShowAddExcelResult(true);
			}
			catch {
				dispatch(loadingActions.hide());
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			}
		}
	};

	const fetchItems = async () => {
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				setItems(await itemService.getAll(project.code, versionNumberEnum.PACK));
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
					clusterService.getSimple(project.code, versionNumberEnum.PACK),
					itemService.getAll(project.code, versionNumberEnum.PACK),
				]);
				setClusters(data[0]);
				setItems(data[1]);
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

	const handleOpenCreateForm = (clusterCode: string) => {
		setModel({
			serviceMasterCode: '',
			clusterCode: clusterCode,
			billCode: '',
			quantity: '0',
		});
		setIsEdit(false);
		setShowForm(true);
	};

	const handleOpenEditForm = (item: ItemViewModel) => {
		setModel({
			serviceMasterCode: item.serviceMasterCode,
			clusterCode: item.clusterCode,
			billCode: item.billCode,
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
					const data: ItemModel = {
						serviceMasterCode: model.serviceMasterCode,
						clusterCode: model.clusterCode,
						billCode: model.billCode,
						quantity: parseFloat(model.quantity),
						projectCode: project.code,
						versionNumber: versionNumberEnum.PACK,
					}
					await itemService.edit(project.code, model.serviceMasterCode, model.clusterCode, data);
					dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
					fetchItems();
				}
				else {
					if (serviceMaster !== null) {
						const data: ItemModel = {
							serviceMasterCode: serviceMaster.code,
							clusterCode: model.clusterCode,
							billCode: model.billCode,
							quantity: parseFloat(model.quantity),
							projectCode: project.code,
							versionNumber: versionNumberEnum.PACK,
						}
						await itemService.create(project.code, data);
						dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
						fetchItems();
					}
				}
			}
			catch {
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	};

	const handleSelect = async (clusterCode: string, serviceMasterCode: string) => {
		if (isInclude(clusterCode, serviceMasterCode, selectedList)) {
			setSelectedList(selectedList.filter(x => !(x.clusterCode === clusterCode && x.serviceMasterCode === serviceMasterCode)));
		}
		else {
			setSelectedList([...selectedList, { clusterCode, serviceMasterCode }]);
		}
	}

	React.useEffect(() => {
		handleRefresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	React.useEffect(() => {
		setSelectedList([]);
	}, [items]);

	React.useEffect(() => {
		setDisplayClusters(
			clusters.filter(x => keyWord.split('|').every(k => x.description.includes(k)))
		);
	}, [clusters, keyWord]);

	return (
		<>
			<FormDialog
				open={showConfirmDelete}
				onClose={() => { setShowConfirmDelete(false) }}
				onSubmit={() => { handleSubmitDelete(); }}
				title="Xác nhận xóa các công tác"
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Typography variant="body2">
							Thao tác này sẽ xóa các công tác được chọn. Vui lòng kiểm tra kỹ trước khi xóa!
						</Typography>
					</Grid>
					{selectedList.map(s => (
						<Grid item xs={12} key={`${s.clusterCode}-${s.serviceMasterCode}`}>
							<Typography variant="subtitle2">{`${s.clusterCode} - ${s.serviceMasterCode}`}</Typography>
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
								<Typography variant="subtitle2">{`${a.item.serviceMasterCode}-${a.item.clusterCode}`}</Typography>
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
						{isEdit ?
							<TextField
								name="serviceMasterCode"
								label="Mã WBS"
								type="text"
								required
								disabled
								value={model.serviceMasterCode}
								onChange={handleChange}
							/>
							:
							<ServiceMastersComboBox
								value={serviceMaster}
								onChange={(value) => { setServiceMaster(value) }}
							/>
						}
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="clusterCode"
							label="Mã điển hình"
							type="text"
							required
							disabled
							value={model.clusterCode}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="billCode"
							label="Mã BOQ"
							type="text"
							required
							value={model.billCode}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="quantity"
							label="Ghi chú"
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
								label="Lọc theo cấu kiện"
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
										filename={`${project.code}_Cong tac.xlsx`}
										url={`/api/project-system/items/get-excel?projectCode=${project.code}&version=${versionNumberEnum.PACK}`}
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
										tooltip="Xóa các công tác đã chọn"
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
								<TableCell className={classes.cell} align="left">Mã công tác</TableCell>
								<TableCell className={classes.cell} align="left">Diễn giải</TableCell>
								<TableCell className={classes.cell} align="left">Mã BOQ</TableCell>
								<TableCell className={classes.cell} align="center">Đơn vị</TableCell>
								<TableCell className={classes.cell} align="right">Khối lượng</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{displayClusters.map(cluster => (
								<React.Fragment key={cluster.code}>
									<TableRow>
										<TableCell style={{ padding: 0, width: 16 }}></TableCell>
										<TableCell className={classes.cell} align="left" style={{ fontWeight: 'bold' }}>{cluster.code}</TableCell>
										<TableCell className={classes.cell} align="left" colSpan={4} style={{ fontWeight: 'bold' }}>{cluster.description}</TableCell>
									</TableRow>
									{items.filter(x => x.clusterCode === cluster.code).map((item, index) => (
										<TableRow key={index}
											style={{
												backgroundColor: isInclude(item.clusterCode, item.serviceMasterCode, selectedList) ? colors.red[100] : 'initial',
											}}
										>
											<TableCell
												style={{
													padding: 0,
													width: 16,
													backgroundColor: isInclude(item.clusterCode, item.serviceMasterCode, selectedList) ? colors.red[500] : colors.teal[100],
												}}
												onClick={() => { handleSelect(item.clusterCode, item.serviceMasterCode) }}
											>
											</TableCell>
											<TableCell
												className={classes.cell}
												align="left"
												style={{ paddingLeft: '32px', cursor: 'pointer', }}
												onClick={() => {
													handleOpenEditForm(item);
												}}
											>
												{item.serviceMasterCode}
											</TableCell>
											<TableCell className={classes.cell} align="left" style={{ paddingLeft: '32px' }}>{item.serviceMasterDescription}</TableCell>
											<TableCell className={classes.cell} align="left">{item.billCode}</TableCell>
											<TableCell className={classes.cell} align="center">{item.serviceMasterUnit}</TableCell>
											<TableCell className={classes.cell} align="right">{format.formatMoney(item.quantity, 3)}</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell style={{ padding: 0, width: 16, backgroundColor: colors.green[300] }}></TableCell>
										<TableCell
											className={classes.cell}
											colSpan={5}
											align="left"
											style={{ cursor: 'pointer', fontStyle: 'italic' }}
											onClick={() => handleOpenCreateForm(cluster.code)}
										>
											+ Thêm công tác mới
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
