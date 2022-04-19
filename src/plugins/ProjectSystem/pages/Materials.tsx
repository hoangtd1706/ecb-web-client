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
	TextField,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
} from '../../../core';

import materialService, {
	MaterialModel,
} from '../services/material';

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

type State = {
	page: number;
}

const initialState: State = {
	page: 1,
}

function Pagination({ filter }: { filter: string }): JSX.Element {
	const classes = useStyles();
	const dispatch: AppDispatch = useDispatch();

	const [state, setState] = React.useState<State>(initialState);

	const [items, setItems] = React.useState<MaterialModel[]>([]);
	const [isEnd, setIsEnd] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const data = await materialService.getByFilter(filter, state.page);
			if (data.length > 0) {
				setItems([...items, ...data]);
			}
			else {
				setIsEnd(true);
			}
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
		}
		finally {
			setIsLoading(false);
		}
	}

	React.useEffect(() => {
		setItems([]);
		setIsLoading(false);
		setIsEnd(false);
		setState({ page: 1 });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter]);

	React.useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	console.log(items);

	return (
		<TableContainer className={classes.container}>
			<Table stickyHeader aria-label="sticky table" size="small">
				<TableHead>
					<TableRow>
						<TableCell style={{ padding: 0, width: 16 }}></TableCell>
						<TableCell className={classes.cell} align="left">Mã công tác</TableCell>
						<TableCell className={classes.cell} align="left">Diễn giải</TableCell>
						<TableCell className={classes.cell} align="left">Đơn vị</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{items.map((items, index) => (
						<TableRow key={index}>
							<TableCell style={{ padding: 0, width: 16 }}></TableCell>
							<TableCell className={classes.cell} align="left">{items.code}</TableCell>
							<TableCell className={classes.cell} align="left">{items.description}</TableCell>
							<TableCell className={classes.cell} align="left">{items.unit}</TableCell>
						</TableRow>
					))}
					{!isEnd && !isLoading && (<TableRow>
						<TableCell style={{ padding: 0, width: 16, backgroundColor: colors.green[300] }}></TableCell>
						<TableCell
							className={classes.cell}
							colSpan={3}
							align="left"
							style={{ cursor: 'pointer', fontStyle: 'italic' }}
							onClick={() => setState({ page: state.page + 1 })}
						>
							+ Tải thêm
						</TableCell>
					</TableRow>)}
					{isLoading && (<TableRow>
						<TableCell style={{ padding: 0, width: 16, backgroundColor: colors.green[300] }}></TableCell>
						<TableCell
							className={classes.cell}
							colSpan={3}
							align="left"
							style={{ cursor: 'pointer', fontStyle: 'italic' }}
						>
							Đang tải dữ liệu
						</TableCell>
					</TableRow>)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default function Materials(): JSX.Element {
	const classes = useStyles();

	const [search, setSearch] = React.useState<string>('');
	const [filter, setFilter] = React.useState<string>('');

	React.useEffect(() => {
		const timeOutId = setTimeout(() => setFilter(search), 1000);
		return () => clearTimeout(timeOutId);
	}, [search]);

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
					<Grid item xs={12}>
						<TextField
							name="search"
							label="Tìm kiếm"
							type="text"
							value={search}
							onChange={(event) => { setSearch(event.target.value); }}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Pagination filter={filter} />
		</Paper>
	);
}
