import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Grid,
} from '@material-ui/core';

import emailService, { BiddingEmailConfigModel } from '../services/biddingEmail';
import {
	IconButton,
	TextField,
	Frame,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

type EmailConfigState = BiddingEmailConfigModel & {
	portString: string;
}

const initialState: EmailConfigState = {
	from: '',
	password: '',
	port: 0,
	portString: '0',
	smtpServer: '',
	userName: '',
}

export default function BiddingEmail(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [emailConfig, setEmailConfig] = React.useState<EmailConfigState>(initialState);
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			const res = await emailService.get();
			setEmailConfig({ ...res, portString: res.port.toFixed(0) });
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
		setEmailConfig({ ...emailConfig, [event.target.name]: event.target.value });
	}

	const handleSave = async () => {
		const model: BiddingEmailConfigModel = {
			from: emailConfig.from,
			password: emailConfig.password,
			port: parseInt(emailConfig.portString, 10),
			smtpServer: emailConfig.smtpServer,
			userName: emailConfig.userName,
		};

		dispatch(loadingActions.show());
		try {
			await emailService.set(model);
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
		<Frame title="Bidding Email">
			<Grid container spacing={1} alignItems="flex-end">
				<Grid item xs={12} md={6}>
					<TextField name="smtpServer" label="Smtp server" value={emailConfig.smtpServer} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField name="portString" label="Port" value={emailConfig.portString} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField name="from" label="From" value={emailConfig.from} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField name="userName" label="Username" value={emailConfig.userName} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField name="password" label="Password" value={emailConfig.password} type={showPassword ? 'text' : 'password'} onChange={handleChange} />
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
