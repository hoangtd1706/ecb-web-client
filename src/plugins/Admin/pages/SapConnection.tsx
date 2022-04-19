import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Grid,
} from '@material-ui/core';
import {
	IconButton,
	TextField,
	Frame,
} from '@nvdunginest/emis-mui';

import sapConnectionService, { SapConnectionConfigModel } from '../services/sapConnection';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

const initialState: SapConnectionConfigModel = {
	url: '',
	client: '',
	username: '',
	password: '',
}

export default function SapConnection(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [sapConnectionConfig, setSapConnectionConfig] = React.useState<SapConnectionConfigModel>(initialState);
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setSapConnectionConfig(await sapConnectionService.get());
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	}

	const handleShowPassword = () => {
		setShowPassword(true);
	}

	const handleHidePassword = () => {
		setShowPassword(false);
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSapConnectionConfig({ ...sapConnectionConfig, [event.target.name]: event.target.value });
	}

	const handleSave = async () => {
		dispatch(loadingActions.show());
		try {
			await sapConnectionService.set(sapConnectionConfig);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	}

	React.useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Frame title="Sap Connection">
			<Grid container spacing={1} alignItems="flex-end">
				<Grid item xs={12} md={6}>
					<TextField name="url" label="Url" value={sapConnectionConfig.url} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField name="client" label="Client" value={sapConnectionConfig.client} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField name="username" label="Username" value={sapConnectionConfig.username} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField name="password" label="Password" value={sapConnectionConfig.password} type={showPassword ? 'text' : 'password'} onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6} container spacing={1}>
					<Grid item>
						<IconButton text="Lưu lại" icon="save" variant="contained" onClick={handleSave} />
					</Grid>
					<Grid item>
						<IconButton
							text="Show password"
							color="danger"
							icon="eye"
							variant="contained"
							onMouseDown={handleShowPassword}
							onMouseUp={handleHidePassword}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Frame>
	)
}
