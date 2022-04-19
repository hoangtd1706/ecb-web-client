import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Link
} from 'react-router-dom';
import {
	Divider,
	TableFooter,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper,
	Typography,
	Hidden,
} from '@material-ui/core';
import {
	Pagination,
} from '@material-ui/lab';

import issueConstants from '../constants/issue';
import { IssueModel } from '../services/issue';
import { IconButton } from '@nvdunginest/emis-mui';
import StatusTag from './StatusTag';
import Tag from './Tag';
import { CounterType, FilterType } from './types';
import IssuesTableToolbar from './IssuesTableToolbar';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	table: {
		width: '100%',
		tableLayout: 'fixed',
	},
	footer: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexDirection: 'row',
		paddingBottom: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	pagination: {
		'& > *': {
			marginTop: theme.spacing(2),
		},
	},
	textMute: {
		opacity: '0.8',
		fontSize: theme.spacing(1.5),
	},
	title: {
		flexGrow: 1,
		[theme.breakpoints.down('sm')]: {
			fontSize: '1rem',
			lineHeight: 1.5,
		},
	},
	cell: {
		display: 'flex',
		flexDirection: 'row',
	},
	cellContainer: {
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(0.75),
			"&:last-child": {
				padding: theme.spacing(0.75),
			}
		},
	},
	status: {
		marginRight: theme.spacing(1),
		alignItems: 'center',
		verticalAlign: 'middle',
		display: 'flex',
	},
}));

type IssuesTableProps = {
	data: IssueModel[];
	title: string;
	onFollow: (id: number) => void;
	onUnFollow: (id: number) => void;
}

export default function IssuesTable({
	data,
	title,
	onFollow,
	onUnFollow,
}: IssuesTableProps): JSX.Element {
	const classes = useStyles();
	const url = '/help-desk/issues';

	const { severity, priority, status } = issueConstants;

	const rowsPerPage = 10;
	const [page, setPage] = React.useState(0);
	const [keyWord, setKeyWord] = React.useState('');

	const [counter, setCounter] = React.useState<CounterType>({
		total: 0,
		closed: 0,
		new: 0,
		process: 0,
		resolved: 0,
	});

	const [rows, setRows] = React.useState<IssueModel[]>([]);
	const [filterModules, setFilterModules] = React.useState<FilterType[]>([]);

	const handleChangePage = (page: number) => {
		setPage(page - 1);
	};

	React.useEffect(() => {
		const unique = [...Array.from(new Set(data.map(x => x.moduleName)))];
		setFilterModules(unique.map(x => {
			return ({
				name: x,
				checked: true,
			})
		}));
	}, [data]);

	React.useEffect(() => {
		const result: IssueModel[] = [];
		data.map((item) => {
			const str = item.title;
			if (str.toUpperCase().includes(keyWord.toUpperCase()) || item.id.toString() === keyWord) {
				if (filterModules.filter(x => x.checked).map(x => x.name).includes(item.moduleName)) {
					result.push(item);
				}
			}
			return true;
		});
		setRows(result);
	}, [data, filterModules, keyWord]);

	React.useEffect(() => {
		let total = 0;
		let _new = 0;
		let process = 0;
		let resolved = 0;
		let closed = 0;
		rows.map(row => {
			total++;
			switch (row.status) {
				case 1:
					_new++;
					break;
				case 2:
					process++;
					break;
				case 3:
					resolved++;
					break;
				case 4:
					closed++;
					break;
				default:
					break;
			}
			return row;
		});

		setCounter({
			total: total,
			new: _new,
			process: process,
			resolved: resolved,
			closed: closed,
		});

		setPage(0);
	}, [rows])

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<IssuesTableToolbar
					title={title}
					keyWord={keyWord}
					onChangeKeyWord={(value: string) => { setKeyWord(value); }}
					counter={counter}
					filterModules={filterModules}
					onChangeFilterModules={(filterModules: FilterType[]) => { setFilterModules(filterModules); }}
				/>
				<Divider />
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="small"
						aria-label="enhanced table"
					>
						<TableBody>
							{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map(item =>
									<TableRow
										hover
										key={item.id}

									>
										<TableCell className={classes.cellContainer}>
											<div className={classes.cell}>
												<div className={classes.status}>
													<StatusTag
														text={status[item.status].text}
														icon={status[item.status].icon}
														color={status[item.status].color}
													/>
												</div>
												<div style={{ flexGrow: 1, width: '70%' }}>
													<div style={{ display: 'flex', width: '100%' }}>
														<Typography display="block" noWrap component="h6" className={classes.title}>
															<Link style={{ textDecoration: 'none' }} to={`${url}/${item.id}`}>{`[#${item.id}] ${item.title}`}</Link>
														</Typography>
													</div>
													<Typography className={classes.textMute}>
														<Hidden xsDown>
															<Tag text={severity[item.severity].text} variant={severity[item.severity].variant} />
														</Hidden>
														<Hidden xsDown>
															<Tag text={priority[item.priority].text} variant={priority[item.priority].variant} />
														</Hidden>
														<Tag text={item.moduleName} variant="primary" />
														<Hidden smDown>{`Tạo bởi ${item.createdBy}-${item.createdByFullName} lúc ${item.createdTime}`}</Hidden>
													</Typography>
												</div>
												<div>
													{item.followed ?
														<IconButton
															tooltip="Hủy theo dõi issue này"
															text="Hủy theo dõi"
															icon="eye-slash"
															color="danger"
															hideTitleOnMobile
															onClick={() => { onUnFollow(item.id); }}
														/> :
														<IconButton
															tooltip="Theo dõi issue này"
															text="Theo dõi"
															icon="eye"
															color="primary"
															hideTitleOnMobile
															onClick={() => { onFollow(item.id); }}
														/>
													}
												</div>
											</div>
										</TableCell>
									</TableRow>
								)}
						</TableBody>
					</Table>
				</TableContainer>
				<TableFooter className={classes.footer} component="div">
					<div className={classes.pagination}>
						<Hidden xsDown>
							<Pagination
								count={Math.ceil(rows.length / rowsPerPage)}
								page={page + 1}
								onChange={(_event, number) => { handleChangePage(number); }}
								shape="rounded"
							/>
						</Hidden>
						<Hidden smUp>
							<Pagination
								count={Math.ceil(rows.length / rowsPerPage)}
								page={page + 1}
								onChange={(_event, number) => { handleChangePage(number); }}
								shape="rounded"
								size="small"
							/>
						</Hidden>
					</div>
				</TableFooter>
			</Paper>
		</div>
	);
}