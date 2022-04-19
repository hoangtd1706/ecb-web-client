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
} from '@material-ui/core';

import {
	IconButton,
	DownloadButton,
} from '@nvdunginest/emis-mui';

import format from '../../../configs/format';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import ProjectComboBox from '../components/ProjectsComboBox';

import {
	ProjectModel,
} from '../services/project';

import resourceService, {
	CbsModel,
} from '../services/resource';

import helper from '../common/helper';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '100%',
	},
	container: {
		maxHeight: 'calc(100% - 85px)',
		overflowY: 'scroll',
		maxWidth: '100%',
		overflowX: 'auto',
	},
	cell: {
		fontSize: '0.75rem',
	},
});

const getPeriods = (data: CbsModel[]): string[] => {
	const periods = data.map(x => x.period);
	const minPeriod = Math.min(...periods);
	const maxPeriod = Math.max(...periods);

	const result: string[] = [];
	let period = minPeriod;
	while (period <= maxPeriod) {
		result.push(`${period.toString().substr(4, 2)}/${period.toString().substr(0, 4)}`)

		period = helper.addPeriod(period);
	}

	return result;
}

export default function CbsReport(): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();

	const [project, setProject] = React.useState<ProjectModel | null>(null);

	const [rbs, setRbs] = React.useState<CbsModel[]>([]);

	const handleProjectChange = (value: ProjectModel) => {
		setProject(value);
	}

	const handleRefresh = async () => {
		dispatch(loadingActions.show());
		if (project !== null) {
			try {
				setRbs(await resourceService.getCbsReport(project.code));
			}
			catch {
				setRbs([]);
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			}
		}
		else {
			setRbs([]);
		}
		dispatch(loadingActions.hide());
	}

	React.useEffect(() => {
		handleRefresh();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	return (
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
					{project !== null && (
						<Grid container spacing={1} item xs={6}>
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
								<DownloadButton
									variant="contained"
									label="Network Activity"
									filename={`${project.code}_Network-activity.xlsx`}
									url={`/api/project-system/resources/get-network-activity-excel?projectCode=${project.code}`}
								/>
							</Grid>
							<Grid item>
								<DownloadButton
									variant="contained"
									label="Material Component"
									filename={`${project.code}_Material-component.xlsx`}
									url={`/api/project-system/resources/get-material-component-excel?projectCode=${project.code}`}
								/>
							</Grid>
							<Grid item>
								<DownloadButton
									variant="contained"
									label="Budget"
									filename={`${project.code}_Budget.xlsx`}
									url={`/api/project-system/resources/get-budget-excel?projectCode=${project.code}`}
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
							<TableCell
								align="left"
								className={classes.cell}
								style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
							>
								Mã vật tư
							</TableCell>
							<TableCell
								align="left"
								className={classes.cell}
								style={{ minWidth: '40%', whiteSpace: 'nowrap' }}
							>
								Diễn giải
							</TableCell>
							<TableCell
								align="center"
								className={classes.cell}
								style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
							>
								Đơn vị
							</TableCell>
							<TableCell
								align="right"
								className={classes.cell}
								style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
							>
								Tổng cộng
							</TableCell>
							{getPeriods(rbs).map(x => (
								<TableCell
									key={x}
									align="right"
									className={classes.cell}
									style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
								>
									{x}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{helper.getRbsViewReport(rbs).map(e => (
							<React.Fragment key={e.item.code}>
								<TableRow style={{ backgroundColor: 'aqua' }}>
									<TableCell
										align="left"
										className={classes.cell}
										style={{ minWidth: '20%', fontWeight: 'bold', whiteSpace: 'nowrap' }}
									>
										{e.item.code}
									</TableCell>
									<TableCell
										align="left"
										className={classes.cell}
										style={{ minWidth: '40%', fontWeight: 'bold', whiteSpace: 'nowrap' }}
									>
										{e.item.description}
									</TableCell>
									<TableCell />
									<TableCell />
									{getPeriods(rbs).map(x => (
										<TableCell
											key={`${x}-${e.item.code}`}
											align="right"
											className={classes.cell}
											style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
										>
										</TableCell>
									))}
								</TableRow>
								{e.data.map(g => (
									<React.Fragment key={`${e.item.code}.${g.item.code}`}>
										<TableRow style={{ backgroundColor: 'aquamarine' }}>
											<TableCell
												align="left"
												className={classes.cell}
												style={{ minWidth: '20%', fontWeight: 'bold', fontStyle: 'italic', paddingLeft: '32px', whiteSpace: 'nowrap' }}
											>
												{`${e.item.code}.${g.item.code}`}
											</TableCell>
											<TableCell
												align="left"
												className={classes.cell}
												style={{ minWidth: '40%', fontWeight: 'bold', fontStyle: 'italic', paddingLeft: '32px', whiteSpace: 'nowrap' }}
											>
												{g.item.description}
											</TableCell>
											<TableCell />
											<TableCell />
											{getPeriods(rbs).map(x => (
												<TableCell
													key={`${x}-${e.item.code}-${g.item.code}`}
													align="right"
													className={classes.cell}
													style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
												>
												</TableCell>
											))}
										</TableRow>
										{g.data.map(m => (
											<React.Fragment key={`${e.item.code}.${g.item.code}.${m.item.code}`}>
												<TableRow>
													<TableCell
														align="left"
														className={classes.cell}
														style={{ minWidth: '20%', fontStyle: 'italic', paddingLeft: '48px', whiteSpace: 'nowrap' }}
													>
														{m.item.code}
													</TableCell>
													<TableCell
														align="left"
														className={classes.cell}
														style={{ minWidth: '40%', fontStyle: 'italic', paddingLeft: '48px', whiteSpace: 'nowrap' }}
													>
														{m.item.description}
													</TableCell>
													<TableCell
														align="center"
														className={classes.cell}
														style={{ minWidth: '20%', fontStyle: 'italic', whiteSpace: 'nowrap' }}
													>
														{m.item.unit}
													</TableCell>
													<TableCell
														align="right"
														className={classes.cell}
														style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
													>
														{format.formatMoney(m.data.reduce((acc, val) => acc + val, 0), 3)}
													</TableCell>
													{m.data.map((x, index) => (
														<TableCell
															key={`${e.item.code}.${g.item.code}.${m.item.code}.${index}`}
															align="right"
															className={classes.cell}
															style={{ minWidth: '20%', whiteSpace: 'nowrap' }}
														>
															{format.formatMoney(x, 3)}
														</TableCell>
													))}
												</TableRow>
											</React.Fragment>
										))}
									</React.Fragment>
								))}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper >
	);
}
