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
	colors,
} from '@material-ui/core';
import {
	FormDialog,
	TextField,
	IconButton,
} from '@nvdunginest/emis-mui';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import format from '../../../configs/format';

import ProjectComboBox from '../components/ProjectsComboBox';

import {
	ProjectModel,
} from '../services/project';

import versionService, {
	VersionModel,
} from '../services/version';
import { branchEnum } from '../services/common';

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

export default function PlannerVersions(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();
	const [showForm, setShowForm] = React.useState(false);

	const [project, setProject] = React.useState<ProjectModel | null>(null);

	const [versions, setVersions] = React.useState<VersionModel[]>([]);
	const [description, setDescription] = React.useState<string>('');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDescription(event.target.value);
	};

	const handleCloseForm = () => {
		setShowForm(false);
	};

	const handleOpenCreateForm = () => {
		setDescription('');
		setShowForm(true);
	};

	const handleSubmit = async () => {
		setShowForm(false);
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				const data: VersionModel = {
					number: 0,
					branch: branchEnum.PLANNER,
					createdBy: '',
					createdByFullName: '',
					createdDate: new Date(),
					description: description,
					projectCode: project.code,
				}
				await versionService.createPlannerVersion(project.code, data);
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
		setProject(value);
	}

	const handleRefresh = async () => {
		dispatch(loadingActions.show());
		if (project !== null) {
			try {
				setVersions(await versionService.getAll(project.code, branchEnum.PLANNER));
			}
			catch {
				setVersions([]);
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
		}
		else {
			setVersions([]);
		}
		dispatch(loadingActions.hide());
	}

	React.useEffect(() => {
		handleRefresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	return (
		<>
			<FormDialog
				title="Tạo phiên bản"
				open={showForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<TextField
							name="description"
							label="Diễn giải"
							type="text"
							required
							value={description}
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
							<ProjectComboBox
								value={project}
								onChange={handleProjectChange}
							/>
						</Grid>
						{project !== null && (
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
				</Grid>
				<TableContainer className={classes.container}>
					<Table stickyHeader aria-label="sticky table" size="small">
						<TableHead>
							<TableRow>
								<TableCell style={{ padding: 0, width: 16 }}></TableCell>
								<TableCell className={classes.cell} align="left">Số phiên bản</TableCell>
								<TableCell className={classes.cell} align="left">Diễn giải</TableCell>
								<TableCell className={classes.cell} align="left">Người tạo</TableCell>
								<TableCell className={classes.cell} align="left">Thời gian</TableCell>
								<TableCell className={classes.cell} align="left"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{versions.map(v => (
								<TableRow key={v.number}>
									<TableCell
										style={{
											padding: 0,
											width: 16,
											backgroundColor: colors.teal[100],
										}}
									>
									</TableCell>
									<TableCell className={classes.cell} align="left">{v.number}</TableCell>
									<TableCell className={classes.cell} align="left">{v.description}</TableCell>
									<TableCell className={classes.cell} align="left">{`${v.createdBy}-${v.createdByFullName}`}</TableCell>
									<TableCell className={classes.cell} align="left">{format.formatDate(new Date(v.createdDate), 'dd-MM-yyyy')}</TableCell>
									<TableCell className={classes.cell} align="left">
										{project !== null && (
											<a
												href={`/project-system/planner/version-data/elements/${project.code}/${v.number}`}
												style={{
													textDecoration: 'none',
												}}
												target="_blank"
												rel="noreferrer"
											>
												<IconButton
													text="WBS"
													color="primary"
													icon="sitemap"
												/>
											</a>
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
