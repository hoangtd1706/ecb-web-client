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
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import userService, { ModeratorModel, RoleType } from '../services/user';

export default function Creators(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [users, setUsers] = React.useState<ModeratorModel[]>([]);
	const [userNumber, setUserNumber] = React.useState<string>('');

	const CREATOR_ROLE: RoleType = 'CREATOR_ROLE';

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserNumber(event.target.value);
	};

	const handleCreate = async () => {
		dispatch(loadingActions.show());
		try {
			await userService.create(CREATOR_ROLE, userNumber);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	}

	const handleRemove = async (_userNumber: string) => {
		dispatch(loadingActions.show());
		try {
			await userService.remove(CREATOR_ROLE, _userNumber);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	}

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setUsers(await userService.getAll());
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	}

	React.useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Frame title="Danh sách người dùng">
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
						onClick={() => { handleCreate(); }}
					/>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					{users.filter(x => x.role === CREATOR_ROLE).map((user, index) => (
						<Chip
							style={{ margin: '4px' }}
							key={index}
							label={`${user.userNumber}-${user.fullName}`}
							onDelete={() => { handleRemove(user.userNumber); }}
							color="primary"
							variant="outlined"
							size="small"
						/>
					))}
				</Grid>
			</Grid>
		</Frame>
	)
}
