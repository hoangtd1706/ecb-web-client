import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Divider,
	Chip,
	Grid,
} from '@material-ui/core';
import {
	IconButton,
	TextField,
	Frame,
} from '@nvdunginest/emis-mui';

import {
	alertActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import userService, { ModeratorModel, RoleType } from '../services/user';
import { reportList } from '../constants/report';

function Users({
	name,
	role,
}: { name: string, role: RoleType }): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [users, setUsers] = React.useState<ModeratorModel[]>([]);
	const [userNumber, setUserNumber] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const USER_ROLE: RoleType = role;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserNumber(event.target.value);
	};

	const handleCreate = async () => {
		setIsLoading(true);
		try {
			await userService.create(USER_ROLE, userNumber);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			setIsLoading(false);
		}
	}

	const handleRemove = async (_userNumber: string) => {
		setIsLoading(true);
		try {
			await userService.remove(USER_ROLE, _userNumber);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			setIsLoading(false);
		}
	}

	const refresh = async () => {
		setIsLoading(true);
		try {
			setUsers(await userService.getAll());
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			setIsLoading(false);
		}
	}

	React.useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Frame title={`Báo cáo ${name}`}>
			<Grid container alignItems="flex-end" spacing={1}>
				<Grid item xs={12} md={6}>
					<TextField
						label="Mã số nhân viên"
						required
						type="text"
						value={userNumber}
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<IconButton
						icon="plus"
						color="primary"
						text="Thêm"
						variant="contained"
						disabled={isLoading}
						onClick={() => { handleCreate(); }}
					/>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					{users.filter(x => x.role === role).map((user, index) => (
						<Chip
							style={{ margin: '4px' }}
							key={index}
							label={`${user.userNumber}-${user.fullName}`}
							onDelete={() => { handleRemove(user.userNumber); }}
							color="primary"
							variant="outlined"
							size="small"
							disabled={isLoading}
						/>
					))}
				</Grid>
			</Grid>
		</Frame>
	)
}

export default function EnterpriseUsers(): JSX.Element {
	return (
		<Grid container spacing={2}>
			{reportList.map(report => (
				<Grid item xs={12} key={report.name}>
					<Users
						name={report.name}
						role={report.role}
					/>
				</Grid>
			))}
		</Grid>
	)
}