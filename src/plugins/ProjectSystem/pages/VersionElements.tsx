import React from 'react';
import { useParams } from 'react-router-dom';
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

import elementService, {
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

export default function VersionElements(): JSX.Element {
	const classes = useStyles();
	const { projectCode, versionNumber }: never = useParams();
	const dispatch: AppDispatch = useDispatch();

	const [current, setCurrent] = React.useState<string | null>(null);

	const [element, setElement] = React.useState<ElementViewModel | null>(null);

	const handleRefresh = async () => {
		dispatch(loadingActions.show());
		try {
			if (current === null) {
				setElement(await elementService.getDetail(projectCode, versionNumber));
			}
			else {
				setElement(await elementService.getDetail(projectCode, versionNumber, current));
			}
		}
		catch {
			setElement(null);
			setCurrent(null);
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		dispatch(loadingActions.hide());
	}

	React.useEffect(() => {
		handleRefresh();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [current, projectCode, versionNumber]);

	return (
		<Paper className={classes.root}>
			<Grid
				container
				style={{ padding: '8px', width: '100%' }}
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
				<Grid container item xs={12} spacing={1}>
					<Grid item>
						<DownloadButton
							variant="contained"
							label="Tải về"
							filename={`${projectCode}_WBS_v${versionNumber}.xlsx`}
							url={`/api/project-system/elements/get-excel?projectCode=${projectCode}&version=${versionNumber}`}
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
	);
}
