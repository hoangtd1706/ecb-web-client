import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
	Paper,
	TableContainer,
	Grid,
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

import ProjectComboBox from '../components/ProjectsComboBox';

import { getDesignerCommitData } from '../common/commitHelper';

import {
	branchEnum,
} from '../services/common';

import userService from '../services/user';

import {
	ProjectModel,
} from '../services/project';

import commitService, {
	AddCommitModel,
	DesignerCommit,
	DesignerTrackingChangeModel,
} from '../services/commit';

import ClustersChangeTable from '../components/ClustersChangeTable';
import ElementClustersChangeTable from '../components/ElementClustersChangeTable';
import ItemsChangeTable from '../components/ItemsChangeTable';

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

export default function DesignerCommits(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();

	const [project, setProject] = React.useState<ProjectModel | null>(null);

	const [model, setModel] = React.useState<DesignerTrackingChangeModel>({
		clusters: [],
		elementClusters: [],
		items: [],
	});
	const [showForm, setShowForm] = React.useState(false);
	const [commitDescription, setCommitDescription] = React.useState<string>('');
	const [tab, setTab] = React.useState<number>(1);

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
			const data: AddCommitModel<DesignerCommit> = {
				header: {
					branch: branchEnum.DESIGNER,
					createdBy: '',
					createdByFullName: '',
					createdTime: new Date(),
					description: commitDescription,
					number: 0,
					projectCode: project !== null ? project.code : '',
				},
				detail: getDesignerCommitData(model),
			}

			if (project !== null) {
				await commitService.designerCommit(project.code, data);
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
				setModel(await commitService.designerTrackingChange(project.code));
			}
			catch {
				setModel({
					clusters: [],
					elementClusters: [],
					items: [],
				});
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
			dispatch(loadingActions.hide());
		}
		else {
			setModel({
				clusters: [],
				elementClusters: [],
				items: [],
			});
		}
	}

	const checkIsApprover = async () => {
		try {
			setIsApprover(await userService.checkRolePermission('APPROVER_DESIGNER_ROLE'));
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
						<Grid container spacing={1} item xs={6} alignItems="flex-end">
							{project !== null && isApprover &&
								(model.clusters.length > 0 || model.elementClusters.length > 0 || model.items.length > 0) && (
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
								)}
							<Grid item>
								<IconButton
									tooltip="Cấu kiện điển hình"
									variant="contained"
									text="Cấu kiện"
									icon="cubes"
									color="primary"
									onClick={() => { setTab(1); }}
								/>
							</Grid>
							<Grid item>
								<IconButton
									tooltip="Mapping WBS - Cấu kiện"
									variant="contained"
									text="Mapping"
									icon="link"
									color="success"
									onClick={() => { setTab(2); }}
								/>
							</Grid>
							<Grid item>
								<IconButton
									tooltip="Công tác"
									variant="contained"
									text="Công tác"
									icon="tasks"
									color="info"
									onClick={() => { setTab(3); }}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<TableContainer className={classes.container}>
					{tab === 1 && <ClustersChangeTable data={model.clusters} />}
					{tab === 2 && <ElementClustersChangeTable data={model.elementClusters} />}
					{tab === 3 && <ItemsChangeTable data={model.items} />}
				</TableContainer>
			</Paper>
		</>
	);
}
