import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, teal, amber } from '@material-ui/core/colors';
import {
	Toolbar,
	Typography,
	Input,
	InputAdornment,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Checkbox,
	FormGroup,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IconButton as IconButtonCUI } from '@nvdunginest/emis-mui';
import { CounterType, FilterType } from './types';
import Counter from './Counter';

const useStyles = makeStyles((theme) => ({
	toolbar: {
		display: 'flex',
		flexDirection: 'column',
		height: 'auto',
	},
	title: {
		flexGrow: 1,
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		paddingTop: theme.spacing(1),
	},
	rowRes: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		paddingTop: theme.spacing(1),
		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column',
		},
	},
	actions: {
		display: 'flex',
		alignItems: 'flex-end',
		color: theme.palette.text.primary,
		paddingRight: theme.spacing(2),
	},
	search: {
		color: theme.palette.text.secondary,
		[theme.breakpoints.down('xs')]: {
			flexGrow: 1,
		},
	},
	input: {
		width: 200,
		[theme.breakpoints.down('xs')]: {
			width: '100%',
		},
	},
}));

type IssuesTableToolbarProps = {
	title: string;
	keyWord: string;
	counter: CounterType;
	filterModules: FilterType[];
	onChangeKeyWord: (value: string) => void;
	onChangeFilterModules: (filterModules: FilterType[]) => void;
}

export default function IssuesTableToolbar({
	title,
	keyWord,
	counter,
	filterModules,
	onChangeKeyWord,
	onChangeFilterModules,
}: IssuesTableToolbarProps): JSX.Element {
	const classes = useStyles();
	const [showForm, setShowForm] = React.useState(false);
	const [selectAll, setSelectAll] = React.useState(false);

	const handleCloseForm = () => {
		setShowForm(false);
	};

	const handleOpenForm = () => {
		setShowForm(true);
	};

	const handleChangeKeyWord = (value: string) => {
		onChangeKeyWord(value);
	};

	const handleClear = () => {
		onChangeKeyWord('');
	};

	React.useEffect(() => {
		const unchecked = filterModules.filter(x => !x.checked);
		if (unchecked.length === 0) {
			setSelectAll(true);
		}
		else {
			setSelectAll(false);
		}
	}, [filterModules])

	const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChangeFilterModules(filterModules.map(f => {
			if (f.name === event.target.name) {
				f.checked = event.target.checked;
			}
			return f;
		}));
	};

	const handleChangeSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFilterModules = filterModules.map(f => {
			f.checked = event.target.checked;
			return f;
		});
		onChangeFilterModules(newFilterModules);
	};

	return (
		<>
			<Toolbar className={classes.toolbar}>
				<div className={classes.rowRes}>
					<Typography noWrap className={classes.title} variant="h6" id="tableTitle" component="div">
						{title}
					</Typography>
					<div className={classes.actions}>
						<div className={classes.actions}>
							<IconButtonCUI
								tooltip="Lọc theo module"
								text="Module"
								icon="filter"
								color="primary"
								onClick={handleOpenForm}
							/>
						</div>
						<div className={classes.search}>
							<Input
								className={classes.input}
								id="input-with-icon-adornment"
								onChange={(event) => { handleChangeKeyWord(event.target.value); }}
								value={keyWord}
								startAdornment={(
									<InputAdornment position="start">
										<FontAwesomeIcon icon="search" style={{ fontSize: '0.9rem', fontWeight: 200 }} />
									</InputAdornment>
								)}
								endAdornment={
									keyWord !== ''
									&& (
										<InputAdornment position="end">
											<IconButton
												edge="end"
												aria-label="toggle password visibility"
												onClick={handleClear}
											>
												<FontAwesomeIcon icon="times" style={{ fontSize: '0.9rem', fontWeight: 200 }} />
											</IconButton>
										</InputAdornment>
									)
								}
							/>
						</div>
					</div>
				</div>
				<div className={classes.row}>
					<Counter icon="bug" color="black" value={counter.total} text="issue" />
					<Counter icon="exclamation-circle" color={amber[500]} value={counter.new} text="issue mới" />
					<Counter icon="sync-alt" color={teal[500]} value={counter.process} text="issue đang xử lý" />
					<Counter icon="question-circle" color={blue[500]} value={counter.resolved} text="issue đã xử lý" />
					<Counter icon="check-circle" color={green[500]} value={counter.closed} text="issue đã đóng" />
				</div>
			</Toolbar>
			<Dialog fullWidth open={showForm} onClose={handleCloseForm} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Lọc theo module</DialogTitle>
				<Divider />
				<DialogContent>
					<FormGroup>
						<FormControlLabel
							control={<Checkbox checked={selectAll} onChange={handleChangeSelectAll} />}
							label="Chọn tất cả"
							color="primary"
						/>
						{filterModules.map((f, index) =>
							<FormControlLabel
								key={index}
								control={<Checkbox checked={f.checked} onChange={handleChangeFilter} name={f.name} />}
								label={f.name}
								color="primary"
							/>)
						}
					</FormGroup>
				</DialogContent>
				<Divider />
				<DialogActions>
					<IconButtonCUI
						tooltip="Đóng lại"
						text="Đóng lại"
						icon="times"
						color="danger"
						onClick={handleCloseForm}
					/>
				</DialogActions>
			</Dialog>
		</>
	);
}