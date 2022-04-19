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

import { getEstimatorCommitData } from '../common/commitHelper';

import {
	branchEnum,
} from '../services/common';

import userService from '../services/user';

import {
	ProjectModel,
} from '../services/project';

import commitService, {
	AddCommitModel,
	EstimatorCommit,
	EstimatorTrackingChangeModel,
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
});

const getRowColor = (status: number): string => {
	switch (status) {
		case 1: return colors.green[500];
		case 2: return colors.amber[500];
		default: return colors.red[500];
	}
}

export default function EstimatorCommits(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();

	const [project, setProject] = React.useState<ProjectModel | null>(null);

	const [model, setModel] = React.useState<EstimatorTrackingChangeModel>({
		resources: [],
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
			const data: AddCommitModel<EstimatorCommit> = {
				header: {
					branch: branchEnum.ESTIMATOR,
					createdBy: '',
					createdByFullName: '',
					createdTime: new Date(),
					description: commitDescription,
					number: 0,
					projectCode: project !== null ? project.code : '',
				},
				detail: getEstimatorCommitData(model),
			}

			if (project !== null) {
				await commitService.estimatorCommit(project.code, data);
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
				setModel(await commitService.estimatorTrackingChange(project.code));
			}
			catch {
				setModel({ resources: [] });
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
			dispatch(loadingActions.hide());
		}
		else {
			setModel({ resources: [] });
		}
	}

	const checkIsApprover = async () => {
		try {
			setIsApprover(await userService.checkRolePermission('APPROVER_ESTIMATOR_ROLE'));
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
						{project !== null && isApprover && model.resources.length > 0 && (
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
								<TableCell align="left" style={{ fontSize: '0.75rem' }}>Mã công tác</TableCell>
								<TableCell align="left" style={{ fontSize: '0.75rem' }}>Diễn giải công tác</TableCell>
								<TableCell align="center" style={{ fontSize: '0.75rem' }}>Đơn vị</TableCell>
								<TableCell align="left" style={{ fontSize: '0.75rem' }}>Mã vật tư</TableCell>
								<TableCell align="left" style={{ fontSize: '0.75rem' }}>Diễn giải vật tư</TableCell>
								<TableCell align="center" style={{ fontSize: '0.75rem' }}>Đơn vị</TableCell>
								<TableCell align="right" style={{ fontSize: '0.75rem' }}>Định mức</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{model.resources.map((r, index) => (
								<TableRow key={index} style={{ backgroundColor: getRowColor(r.status) }}>
									<TableCell align="left" style={{ fontSize: '0.75rem' }}>
										<Grid container direction="column">
											<Grid item>
												{r.post !== null ? r.post.serviceMasterCode : '-'}
											</Grid>
											<Grid item>
												{r.pack !== null ? r.pack.serviceMasterCode : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align="left" style={{ fontSize: '0.75rem' }}>
										<Grid container direction="column">
											<Grid item>
												{r.post !== null ? r.post.serviceMasterDescription : '-'}
											</Grid>
											<Grid item>
												{r.pack !== null ? r.pack.serviceMasterDescription : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align="center" style={{ fontSize: '0.75rem' }}>
										<Grid container direction="column">
											<Grid item>
												{r.post !== null ? r.post.serviceMasterUnit : '-'}
											</Grid>
											<Grid item>
												{r.pack !== null ? r.pack.serviceMasterUnit : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align="left" style={{ fontSize: '0.75rem' }}>
										<Grid container direction="column">
											<Grid item>
												{r.post !== null ? r.post.materialCode : '-'}
											</Grid>
											<Grid item>
												{r.pack !== null ? r.pack.materialCode : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align="left" style={{ fontSize: '0.75rem' }}>
										<Grid container direction="column">
											<Grid item>
												{r.post !== null ? r.post.materialDescription : '-'}
											</Grid>
											<Grid item>
												{r.pack !== null ? r.pack.materialDescription : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align="center" style={{ fontSize: '0.75rem' }}>
										<Grid container direction="column">
											<Grid item>
												{r.post !== null ? r.post.materialUnit : '-'}
											</Grid>
											<Grid item>
												{r.pack !== null ? r.pack.materialUnit : '-'}
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align="right" style={{ fontSize: '0.75rem' }}>
										<Grid container direction="column">
											<Grid item>
												{r.post !== null ? format.formatMoney(r.post.quantity, 3) : '-'}
											</Grid>
											<Grid item>
												{r.pack !== null ? format.formatMoney(r.pack.quantity, 3) : '-'}
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
