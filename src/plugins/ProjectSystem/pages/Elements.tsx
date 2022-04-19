import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
	Paper,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Breadcrumbs,
	colors,
} from '@material-ui/core';
import {
	FormDialog,
	UploadButton,
	IconButton,
	DownloadButton,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import format from '../../../configs/format';
import helper from '../common/helper';

import ProjectComboBox from '../components/ProjectsComboBox';

import {
	versionNumberEnum,
	AddFromExcelModel,
} from '../services/common';

import {
	ProjectModel,
} from '../services/project';

import elementService, {
	ElementModel,
	ElementViewModel,
} from '../services/element';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%',
	},
	container: {
		maxHeight: 'calc(100% - 144px)',
		overflowY: 'scroll',
	},
	link: {
		fontSize: '0.75rem',
		textDecoration: 'none',
		cursor: 'pointer',
	},
	cell: {
		fontSize: '0.75rem',
	},
});

const getWidth = (ts: Date, tf: Date, s: Date, f: Date): number => {
	return helper.getDays(s, f) * 368 / helper.getDays(ts, tf);
}

const getPadding = (ts: Date, tf: Date, s: Date): number => {
	return (helper.getDays(ts, s) - 1) * 368 / helper.getDays(ts, tf);
}

export default function Elements(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();

	const [selectedProject, setSelectedProject] = React.useState<ProjectModel | null>(null);
	const [current, setCurrent] = React.useState<string | null>(null);

	const [element, setElement] = React.useState<ElementViewModel | null>(null);

	const [selectedList, setSelectedList] = React.useState<string[]>([]);

	const [showAddExcelResult, setShowAddExcelResult] = React.useState(false);
	const [addExcelResult, setAddExcelResult] = React.useState<AddFromExcelModel<ElementModel>[]>([]);

	const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

	const handleSubmitDelete = async () => {
		setShowConfirmDelete(false);
		if (selectedProject !== null) {
			dispatch(loadingActions.show());
			try {
				await elementService.remove(selectedProject.code, selectedList);
				handleRefresh();
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
		if (files.length >= 1 && selectedProject !== null) {
			setAddExcelResult([]);
			dispatch(loadingActions.show());
			try {
				setAddExcelResult(await elementService.addFromExcel(selectedProject.code, files[0]));
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
		setSelectedProject(value);
		setCurrent(null);
	}

	const handleRefresh = async () => {
		if (selectedProject !== null) {
			dispatch(loadingActions.show());
			try {
				if (current === null) {
					setElement(await elementService.getDetail(selectedProject.code, versionNumberEnum.PACK));
				}
				else {
					setElement(await elementService.getDetail(selectedProject.code, versionNumberEnum.PACK, current));
				}
			}
			catch {
				setElement(null);
				setCurrent(null);
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
			dispatch(loadingActions.hide());
		}
		else {
			setElement(null);
			setCurrent(null);
		}
	}

	const handleSelect = async (elementCode: string) => {
		if (selectedList.includes(elementCode)) {
			setSelectedList(selectedList.filter(x => x !== elementCode));
		}
		else {
			setSelectedList([...selectedList, elementCode]);
		}
	}

	React.useEffect(() => {
		handleRefresh();
		setSelectedList([]);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedProject, current]);

	return (
		<>
			<FormDialog
				open={showConfirmDelete}
				onClose={() => { setShowConfirmDelete(false) }}
				onSubmit={() => { handleSubmitDelete(); }}
				title="Xác nhận xóa các WBS"
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Typography variant="body2">Vui lòng kiểm tra kỹ các WBS trước khi xóa!</Typography>

					</Grid>
					{selectedList.map(s => (
						<Grid item xs={12} key={s}>
							<Typography variant="subtitle2">{s}</Typography>
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
								<Typography variant="subtitle2">{`${a.item.code} - ${a.item.description}`}</Typography>
							</Grid>
							<Grid item xs={12} md={9} style={{ color: a.isAdded ? 'green' : 'red' }}>
								<Typography variant="caption">{a.message}</Typography>
							</Grid>
						</Grid>
					))}
				</Grid>
			</FormDialog>
			<Paper className={classes.root}>
				<Grid
					container
					style={{ padding: '8px', width: '100%' }}
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
						<Grid container item xs={12} spacing={1}>
							<Grid item>
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
							</Grid>
							<Grid item>
								<DownloadButton
									variant="contained"
									label="Tải về"
									filename={`${selectedProject.code}_WBS.xlsx`}
									url={`/api/project-system/elements/get-excel?projectCode=${selectedProject.code}&version=${versionNumberEnum.PACK}`}
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
									tooltip="Xóa các WBS đã chọn"
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
				{element !== null && (
					<>
						<Breadcrumbs style={{ paddingLeft: 16, paddingRight: 16 }} aria-label="breadcrumb">
							{element.breadcrumbs.map(node => (
								<a
									className={classes.link}
									key={node.code}
									style={{ fontWeight: current === node.code ? 'bold' : 'normal' }}
									onClick={() => {
										setCurrent(node.code);
									}}
								>
									{node.text}
								</a>
							))}
						</Breadcrumbs>
						<TableContainer className={classes.container}>
							<Table stickyHeader aria-label="sticky table" size="small">
								<TableHead>
									<TableRow>
										<TableCell style={{ padding: 0, width: 16 }}></TableCell>
										<TableCell className={classes.cell} align="left">Mã WBS</TableCell>
										<TableCell className={classes.cell} align="left">Diễn giải</TableCell>
										<TableCell className={classes.cell} align="right">Bắt đầu</TableCell>
										<TableCell className={classes.cell} align="right">Kết thúc</TableCell>
										<TableCell className={classes.cell} align="right" style={{ width: 400 }}></TableCell>
									</TableRow>
									<TableRow>
										<TableCell style={{ padding: 0, width: 16 }}></TableCell>
										<TableCell className={classes.cell} align="left">{element.code}</TableCell>
										<TableCell className={classes.cell} align="left">{element.description}</TableCell>
										<TableCell className={classes.cell} align="right">{format.formatDate(new Date(element.start), 'dd/MM/yyyy')}</TableCell>
										<TableCell className={classes.cell} align="right">{format.formatDate(new Date(element.finish), 'dd/MM/yyyy')}</TableCell>
										<TableCell className={classes.cell} align="right" style={{ width: 400 }}>
											<div
												style={{ backgroundColor: 'blue', width: 368, height: 12 }}
											></div>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{element.children.map(c => (
										<TableRow key={c.code}
											style={{
												backgroundColor: selectedList.includes(c.code) ? colors.red[100] : 'initial',
											}}
										>
											<TableCell
												style={{
													padding: 0,
													width: 16,
													backgroundColor: selectedList.includes(c.code) ? colors.red[500] : colors.teal[100],
												}}
												onClick={() => { handleSelect(c.code) }}
											>
											</TableCell>
											<TableCell
												align="left"
												className={classes.cell}
												style={{
													paddingLeft: 32,
													cursor: c.isLeaf ? 'initial' : 'pointer'
												}}
												onClick={() => {
													if (!c.isLeaf) {
														setCurrent(c.code);
													}
												}}
											>
												{c.code}
											</TableCell>
											<TableCell className={classes.cell} align="left" style={{ paddingLeft: 32 }}>{c.description}</TableCell>
											<TableCell className={classes.cell} align="right">{format.formatDate(new Date(c.start), 'dd/MM/yyyy')}</TableCell>
											<TableCell className={classes.cell} align="right">{format.formatDate(new Date(c.finish), 'dd/MM/yyyy')}</TableCell>
											<TableCell align="right" style={{
												width: 400,
												paddingLeft: 16 + getPadding(new Date(element.start), new Date(element.finish), new Date(c.start)),
											}}>
												<div
													style={{
														backgroundColor: 'green',
														width: getWidth(new Date(element.start), new Date(element.finish), new Date(c.start), new Date(c.finish)),
														height: 12,
													}}
												></div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</>
				)}
			</Paper>
		</>
	);
}
