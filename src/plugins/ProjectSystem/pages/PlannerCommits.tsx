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
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import format from '../../../configs/format';

import ProjectComboBox from '../components/ProjectsComboBox';

import { getPlannerCommitData } from '../common/commitHelper';

import {
	branchEnum,
} from '../services/common';

import userService from '../services/user';

import {
	ProjectModel,
} from '../services/project';

import commitService, {
	AddCommitModel,
	PlannerCommit,
	PlannerTrackingChangeModel,
} from '../services/commit';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%',
	},
	container: {
		maxHeight: 'calc(100% - 85px)',
		overflowY: 'scroll',
	},
	cell: {
		fontSize: '0.75rem',
	},
});

const getRowColor = (status: number): string => {
	switch (status) {
		case 1: return colors.green[500];
		case 2: return colors.amber[500];
		default: return colors.red[500];
	}
}

export default function PlannerCommits(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();

	const [project, setProject] = React.useState<ProjectModel | null>(null);

	const [model, setModel] = React.useState<PlannerTrackingChangeModel>({
		elements: [],
	});
	const [showForm, setShowForm] = React.useState(false);
	const [commitDescription, setCommitDescription] = React.useState<string>('');

	const [isApprover, setIsApprover] = React.useState(false);

	const handleCloseForm = () => {
		setShowForm(false);
	};

	const handleOpenForm = () => {
		setCommitDescription('');
		setShowForm(true);
	};

	const handleSubmit = async () => {
		setShowForm(false);
		dispatch(loadingActions.show());
		try {
			const data: AddCommitModel<PlannerCommit> = {
				header: {
					branch: branchEnum.PLANNER,
					createdBy: '',
					createdByFullName: '',
					createdTime: new Date(),
					description: commitDescription,
					number: 0,
					projectCode: project !== null ? project.code : '',
				},
				detail: getPlannerCommitData(model),
			}

			if (project !== null) {
				await commitService.plannerCommit(project.code, data);
			}

			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			handleRefresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	};

	const handleProjectChange = (value: ProjectModel) => {
		setProject(value);
	};

	const handleRefresh = async () => {
		if (project !== null) {
			dispatch(loadingActions.show());
			try {
				setModel(await commitService.plannerTrackingChange(project.code));
			}
			catch {
				setModel({ elements: [] });
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
			dispatch(loadingActions.hide());
		}
		else {
			setModel({ elements: [] });
		}
	}

	const checkIsApprover = async () => {
		try {
			setIsApprover(await userService.checkRolePermission('APPROVER_PLANNER_ROLE'));
		}
		catch {
			setIsApprover(false);
		}
	}

	React.useEffect(() => {
		handleRefresh();
		checkIsApprover();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	return (
		<>
			<FormDialog
				title="Cập nhật thay đổi lên server"
				open={showForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<TextField
							name="commitDescription"
							label="Mô tả nội dung cập nhật"
							type="text"
							required
							value={commitDescription}
							onChange={(e) => { setCommitDescription(e.target.value); }}
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
						<Grid item xs={6}>
							<ProjectComboBox
								value={project}
								onChange={handleProjectChange}
							/>
						</Grid>
						{project !== null && isApprover && model.elements.length > 0 && (
							<Grid container spacing={1} item xs={6} alignItems="flex-end">
								<Grid item>
									<IconButton
										tooltip="Cập nhật thay đổi"
										variant="contained"
										text="Commit"
										icon="long-arrow-alt-up"
										color="danger"
										onClick={handleOpenForm}
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
								<TableCell className={classes.cell} align="left">WBS</TableCell>
								<TableCell className={classes.cell} align="left">Diễn giải</TableCell>
								<TableCell className={classes.cell} align="right">Level</TableCell>
								<TableCell className={classes.cell} align="right">Bắt đầu</TableCell>
								<TableCell className={classes.cell} align="right">Kết thúc</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{model.elements.map((item, index) => (
								<TableRow key={index} style={{ backgroundColor: getRowColor(item.status) }}>
									<TableCell className={classes.cell} align="left">
										<Grid container direction="column">
											<Grid item>
												{item.post !== null ? item.post.code : '-'}
											</Grid>
											<Grid item>
												{item.pack !== null ? item.pack.code : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell className={classes.cell} align="left">
										<Grid container direction="column">
											<Grid item>
												{item.post !== null ? item.post.description : '-'}
											</Grid>
											<Grid item>
												{item.pack !== null ? item.pack.description : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell className={classes.cell} align="right">
										<Grid container direction="column">
											<Grid item>
												{item.post !== null ? item.post.level : '-'}
											</Grid>
											<Grid item>
												{item.pack !== null ? item.pack.level : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell className={classes.cell} align="right">
										<Grid container direction="column">
											<Grid item>
												{item.post !== null ? format.formatDate(new Date(item.post.start), 'dd/MM/yyyy') : '-'}
											</Grid>
											<Grid item>
												{item.pack !== null ? format.formatDate(new Date(item.pack.start), 'dd/MM/yyyy') : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell className={classes.cell} align="right">
										<Grid container direction="column">
											<Grid item>
												{item.post !== null ? format.formatDate(new Date(item.post.finish), 'dd/MM/yyyy') : '-'}
											</Grid>
											<Grid item>
												{item.pack !== null ? format.formatDate(new Date(item.pack.finish), 'dd/MM/yyyy') : '-'}
											</Grid>
										</Grid>
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
