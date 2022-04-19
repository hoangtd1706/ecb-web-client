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

import ProjectsComboBox from '../components/ProjectsComboBox';
import ClustersComboBox from '../components/ClustersComboBox';

import {
	versionNumberEnum,
	AddFromExcelModel,
} from '../services/common';

import {
	ProjectModel,
} from '../services/project';

import elementService, {
	ElementModel,
} from '../services/element';

import { ClusterModel } from '../services/cluster';

import elementClusterService, {
	ElementClusterViewModel,
	ElementClusterModel,
	ElementClusterRemoveModel,
} from '../services/elementCluster';

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

type ElementClusterState = {
	elementCode: string,
	clusterCode: string,
	quantity: string,
}

const initialState: ElementClusterState = {
	elementCode: '',
	clusterCode: '',
	quantity: '',
}

const isInclude = (elementCode: string, clusterCode: string, data: ElementClusterRemoveModel[]): boolean => {
	return data.find(x => x.clusterCode === clusterCode && x.elementCode === elementCode) !== undefined;
}

export default function ElementClusters(): JSX.Element {
	const classes = useStyles();

	const dispatch: AppDispatch = useDispatch();
	const [showForm, setShowForm] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);

	const [project, setProject] = React.useState<ProjectModel | null>(null);
	const [cluster, setCluster] = React.useState<ClusterModel | null>(null);

	const [elements, setElements] = React.useState<ElementModel[]>([]);
	const [displayElements, setDisplayElements] = React.useState<ElementModel[]>([]);
	const [elementClusters, setElementClusters] = React.useState<ElementClusterViewModel[]>([]);
	const [item, setItem] = React.useState<ElementClusterState>(initialState);

	const [selectedList, setSelectedList] = React.useState<ElementClusterRemoveModel[]>([]);

	const [showAddExcelResult, setShowAddExcelResult] = React.useState(false);
	const [addExcelResult, setAddExcelResult] = React.useState<AddFromExcelModel<ElementClusterModel>[]>([]);

	const [keyWord, setKeyWord] = React.useState<string>('');
	const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

	const handleSubmitDelete = async () => {
		setShowConfirmDelete(false);
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				await elementClusterService.remove(project.code, selectedList);
				fetchElementClusters();
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
				setAddExcelResult(await elementClusterService.addFromExcel(project.code, files[0]));
				handleRefresh();
				setShowAddExcelResult(true);
			}
			catch {
				dispatch(loadingActions.hide());
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			}
		}
	};

	const handleProjectChange = (value: ProjectModel) => {
		setProject(value);
	}

	const fetchElementClusters = async () => {
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				setElementClusters(await elementClusterService.getAll(project.code, versionNumberEnum.PACK));
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
					elementService.getLeaf(project.code, versionNumberEnum.POST),
					elementClusterService.getAll(project.code, versionNumberEnum.PACK),
				]);
				setElements(data[0]);
				setElementClusters(data[1]);
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
		setItem({ ...item, [event.target.name]: event.target.value });
	};

	const handleCloseForm = () => {
		setShowForm(false);
	};

	const handleOpenCreateForm = (elementCode: string) => {
		setItem({
			clusterCode: '',
			elementCode: elementCode,
			quantity: '0',
		});
		setIsEdit(false);
		setShowForm(true);
	};

	const handleOpenEditForm = (item: ElementClusterViewModel) => {
		setItem({
			elementCode: item.elementCode,
			clusterCode: item.clusterCode,
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
					const model: ElementClusterModel = {
						elementCode: item.elementCode,
						clusterCode: item.clusterCode,
						quantity: parseFloat(item.quantity),
						projectCode: project.code,
						versionNumber: versionNumberEnum.PACK,
					}
					await elementClusterService.edit(project.code, item.elementCode, item.clusterCode, model);
					dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
					fetchElementClusters();
				}
				else {
					if (cluster !== null) {
						const model: ElementClusterModel = {
							elementCode: item.elementCode,
							clusterCode: cluster.code,
							quantity: parseFloat(item.quantity),
							projectCode: project.code,
							versionNumber: versionNumberEnum.PACK,
						}
						await elementClusterService.create(project.code, model);
						dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
						fetchElementClusters();
					}
				}
			}
			catch {
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	};

	const handleSelect = async (elementCode: string, clusterCode: string) => {
		if (isInclude(elementCode, clusterCode, selectedList)) {
			setSelectedList(selectedList.filter(x => !(x.clusterCode === clusterCode && x.elementCode === elementCode)));
		}
		else {
			setSelectedList([...selectedList, { clusterCode, elementCode }]);
		}
	}

	React.useEffect(() => {
		handleRefresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	React.useEffect(() => {
		setSelectedList([]);
	}, [elementClusters]);

	React.useEffect(() => {
		setDisplayElements(
			elements.filter(x => keyWord.split('|').every(k => x.description.includes(k)))
		);
	}, [elements, keyWord]);

	return (
		<>
			<FormDialog
				open={showConfirmDelete}
				onClose={() => { setShowConfirmDelete(false) }}
				onSubmit={() => { handleSubmitDelete(); }}
				title="Xác nhận xóa các mapping"
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Typography variant="body2">
							Thao tác này sẽ xóa các mapping được chọn. Vui lòng kiểm tra kỹ trước khi xóa!
						</Typography>
					</Grid>
					{selectedList.map(s => (
						<Grid item xs={12} key={`${s.elementCode}-${s.clusterCode}`}>
							<Typography variant="subtitle2">{`${s.elementCode} - ${s.clusterCode}`}</Typography>
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
								<Typography variant="subtitle2">{`${a.item.elementCode}-${a.item.clusterCode}`}</Typography>
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
							name="elementCode"
							label="Mã WBS"
							type="text"
							required
							disabled
							value={item.elementCode}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12}>
						{isEdit ?
							<TextField
								name="clusterCode"
								label="Mã điển hình"
								type="text"
								required
								disabled
								value={item.clusterCode}
								onChange={handleChange}
							/>
							:
							project !== null && <ClustersComboBox
								projectCode={project.code}
								value={cluster}
								onChange={(value) => { setCluster(value) }}
							/>
						}
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="quantity"
							label="Ghi chú"
							type="number"
							required
							value={item.quantity}
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
								onChange={handleProjectChange}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								name="keyWord"
								label="Lọc WBS"
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
										filename={`${project.code}_Mapping.xlsx`}
										url={`/api/project-system/elementClusters/get-excel?projectCode=${project.code}&version=${versionNumberEnum.PACK}`}
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
										tooltip="Xóa các mapping đã chọn"
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
								<TableCell className={classes.cell} align="left">Mã cấu kiện</TableCell>
								<TableCell className={classes.cell} align="left">Diễn giải cấu kiện</TableCell>
								<TableCell className={classes.cell} align="right">Số lượng</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{displayElements.map(element => (
								<React.Fragment key={element.code}>
									<TableRow>
										<TableCell style={{ padding: 0, width: 16 }}></TableCell>
										<TableCell className={classes.cell} align="left" style={{ fontWeight: 'bold' }}>{element.code}</TableCell>
										<TableCell className={classes.cell} align="left" colSpan={2} style={{ fontWeight: 'bold' }}>{element.description}</TableCell>
									</TableRow>
									{elementClusters.filter(x => x.elementCode === element.code).map((item, index) => (
										<TableRow key={index}
											style={{
												backgroundColor: isInclude(item.elementCode, item.clusterCode, selectedList) ? colors.red[100] : 'initial',
											}}
										>
											<TableCell
												style={{
													padding: 0,
													width: 16,
													backgroundColor: isInclude(item.elementCode, item.clusterCode, selectedList) ? colors.red[500] : colors.teal[100],
												}}
												onClick={() => { handleSelect(item.elementCode, item.clusterCode) }}
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
												{item.clusterCode}
											</TableCell>
											<TableCell className={classes.cell} align="left" style={{ paddingLeft: '32px' }}>{item.clusterDescription}</TableCell>
											<TableCell className={classes.cell} align="right">{item.quantity}</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell style={{ padding: 0, width: 16, backgroundColor: colors.green[300] }}></TableCell>
										<TableCell
											className={classes.cell}
											colSpan={4}
											align="left"
											style={{ cursor: 'pointer', fontStyle: 'italic' }}
											onClick={() => handleOpenCreateForm(element.code)}
										>
											+ Thêm cấu kiện mới
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
