import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Paper,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Breadcrumbs,
	FormControlLabel,
	Checkbox,
	colors,
	Typography,
} from '@material-ui/core';
import {
	IconButton,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import format from '../../../configs/format';

import ProjectComboBox from '../components/ProjectsComboBox';

import {
	versionNumberEnum,
} from '../services/common';

import {
	ProjectModel,
} from '../services/project';

import elementService, {
	ElementViewModel,
} from '../services/element';

import confirmationService, {
	ConfirmationModel,
} from '../services/confirmation';

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

type ConfirmationBoxProps = {
	label: string;
	checked: boolean;
	disable?: boolean;
	onChange?: () => void;
}

function ConfirmationBox({
	label,
	checked,
	disable = false,
	onChange = () => { return; },
}: ConfirmationBoxProps): JSX.Element {
	return (
		<FormControlLabel
			style={{ height: '10px' }}
			control={
				<Checkbox
					icon={<FontAwesomeIcon style={{ fontSize: '0.9rem' }} icon={{ iconName: 'circle', prefix: 'far' }} />}
					checkedIcon={<FontAwesomeIcon style={{ fontSize: '0.9rem', color: colors.green[500] }} icon="check-circle" />}
					disabled={disable}
					checked={checked}
					onChange={() => { onChange(); }}
				/>
			}
			label={<Typography style={{ fontSize: '0.75rem' }} variant="body1">{label}</Typography>}
		/>
	);
}

export default function Confirmations(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();

	const [selectedProject, setSelectedProject] = React.useState<ProjectModel | null>(null);
	const [current, setCurrent] = React.useState<string | null>(null);

	const [element, setElement] = React.useState<ElementViewModel | null>(null);
	const [pack, setPack] = React.useState<ConfirmationModel[]>([]);
	const [post, setPost] = React.useState<ConfirmationModel[]>([]);

	const handleProjectChange = (value: ProjectModel) => {
		setSelectedProject(value);
		setCurrent(null);
	}

	const handleCreate = async (elementCode: string) => {
		if (selectedProject !== null) {
			dispatch(loadingActions.show());
			try {
				await confirmationService.create(selectedProject.code, elementCode);
				handleRefresh();
				dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			}
			catch {
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	}

	const handleDelete = async (elementCode: string) => {
		if (selectedProject !== null) {
			dispatch(loadingActions.show());
			try {
				await confirmationService.remove(selectedProject.code, elementCode);
				const data = await Promise.all([
					confirmationService.getAll(selectedProject.code, versionNumberEnum.PACK),
					confirmationService.getAll(selectedProject.code, versionNumberEnum.POST),
				]);
				setPack(data[0]);
				setPost(data[1]);
				dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
				dispatch(loadingActions.hide());
			}
			catch {
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	}

	const handleRefresh = async () => {
		if (selectedProject !== null) {
			dispatch(loadingActions.show());
			try {
				if (current === null) {
					setElement(await elementService.getDetail(selectedProject.code, versionNumberEnum.POST));
				}
				else {
					setElement(await elementService.getDetail(selectedProject.code, versionNumberEnum.POST, current));
				}
				const data = await Promise.all([
					confirmationService.getAll(selectedProject.code, versionNumberEnum.PACK),
					confirmationService.getAll(selectedProject.code, versionNumberEnum.POST),
				]);
				setPack(data[0]);
				setPost(data[1]);
			}
			catch {
				setElement(null);
				setCurrent(null);
				setPack([]);
				setPost([]);
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
			dispatch(loadingActions.hide());
		}
		else {
			setElement(null);
			setCurrent(null);
			setPack([]);
			setPost([]);
		}
	}

	React.useEffect(() => {
		handleRefresh();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedProject, current]);

	return (
		<>
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
								<IconButton
									tooltip="Làm mới"
									variant="contained"
									text="Làm mới"
									color="success"
									icon="sync-alt"
									onClick={handleRefresh}
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
										<TableCell className={classes.cell} align="left">Trạng thái</TableCell>
										<TableCell className={classes.cell} align="right">Bắt đầu</TableCell>
										<TableCell className={classes.cell} align="right">Kết thúc</TableCell>
									</TableRow>
									<TableRow>
										<TableCell style={{ padding: 0, width: 16 }}></TableCell>
										<TableCell className={classes.cell} align="left">{element.code}</TableCell>
										<TableCell className={classes.cell} align="left">{element.description}</TableCell>
										<TableCell className={classes.cell} align="left"></TableCell>
										<TableCell className={classes.cell} align="right">{format.formatDate(new Date(element.start), 'dd/MM/yyyy')}</TableCell>
										<TableCell className={classes.cell} align="right">{format.formatDate(new Date(element.finish), 'dd/MM/yyyy')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{element.children.map(c => (
										<TableRow key={c.code}>
											<TableCell
												style={{
													padding: 0,
													width: 16,
													backgroundColor: colors.teal[100],
												}}
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
											{c.isLeaf ? (
												<TableCell className={classes.cell} align="left">
													{pack.find(x => x.elementCode === c.code) !== undefined ? (
														post.find(x => x.elementCode === c.code) !== undefined ? (
															<ConfirmationBox
																checked={true}
																label="Đã phê duyệt"
																disable
																onChange={() => { return; }}
															/>
														) : (
															<ConfirmationBox
																checked={true}
																label="Chờ phê duyệt"
																onChange={() => { handleDelete(c.code); }}
															/>
														)
													) : (
														<ConfirmationBox
															checked={false}
															label="Đang thực hiện..."
															onChange={() => { handleCreate(c.code); }}
														/>
													)}
												</TableCell>
											) : (
												<TableCell className={classes.cell} align="left"></TableCell>
											)}
											<TableCell className={classes.cell} align="right">{format.formatDate(new Date(c.start), 'dd/MM/yyyy')}</TableCell>
											<TableCell className={classes.cell} align="right">{format.formatDate(new Date(c.finish), 'dd/MM/yyyy')}</TableCell>
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
