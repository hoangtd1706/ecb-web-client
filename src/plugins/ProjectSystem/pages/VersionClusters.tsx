import React from 'react';
import { useParams } from 'react-router-dom';
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
	IconButton,
	DownloadButton,
} from '@nvdunginest/emis-mui';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import clusterService, {
	ClusterViewModel,
} from '../services/cluster';

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

export default function Clusters(): JSX.Element {
	const classes = useStyles();
	const { projectCode, versionNumber }: never = useParams();
	const dispatch: AppDispatch = useDispatch();

	const [clusters, setClusters] = React.useState<ClusterViewModel[]>([]);

	const handleRefresh = async () => {
		dispatch(loadingActions.show());
		try {
			setClusters(await clusterService.getAll(projectCode, versionNumber));
		}
		catch {
			setClusters([]);
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	}

	React.useEffect(() => {
		handleRefresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectCode, versionNumber]);

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
						<Typography variant="h6">{`Dự án: ${projectCode}`}</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6">{`Phiên bản: ${versionNumber}`}</Typography>
					</Grid>
					<Grid item>
						<DownloadButton
							variant="contained"
							label="Tải về"
							filename={`${projectCode}_${versionNumber}_Dien hinh.xlsx`}
							url={`/api/project-system/clusters/get-excel?projectCode=${projectCode}&version=${versionNumber}`}
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
			</Grid>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table" size="small">
					<TableHead>
						<TableRow>
							<TableCell style={{ padding: 0, width: 16 }}></TableCell>
							<TableCell className={classes.cell} align="left">Mã điển hình</TableCell>
							<TableCell className={classes.cell} align="left">Diễn giải</TableCell>
							<TableCell className={classes.cell} align="left">Ghi chú</TableCell>
							<TableCell className={classes.cell} align="left">Chiết tính</TableCell>
							<TableCell className={classes.cell} align="right">Số lượng</TableCell>
							<TableCell className={classes.cell} align="right">Công tác</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{clusters.map(cluster => (
							<TableRow key={cluster.code}>
								<TableCell
									style={{
										padding: 0,
										width: 16,
										backgroundColor: colors.teal[100],
									}}
								>
								</TableCell>
								<TableCell className={classes.cell} align="left">{cluster.code}</TableCell>
								<TableCell className={classes.cell} align="left">{cluster.description}</TableCell>
								<TableCell className={classes.cell} align="left">{cluster.note}</TableCell>
								<TableCell className={classes.cell} align="left">
									<a
										href={cluster.filePath}
										style={{
											textDecoration: 'none',
										}}
										target="_blank"
										rel="noreferrer"
									>
										Chiết tính
									</a>
								</TableCell>
								<TableCell className={classes.cell} align="right">{cluster.elementCount}</TableCell>
								<TableCell className={classes.cell} align="right">{cluster.itemCount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
