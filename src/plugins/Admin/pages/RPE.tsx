import React from 'react';
import {
	Grid,
	Typography,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import {
	IconButton,
	TextField,
	Frame,
} from '@nvdunginest/emis-mui';

import rpeService, { RPEModel } from '../services/resetPasswordEmailTemplate';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

const initialState: RPEModel = {
	subject: '',
	content: '',
}

export default function RPE(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [rpeConfig, setRPEConfig] = React.useState<RPEModel>(initialState);

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setRPEConfig(await rpeService.get())
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRPEConfig({ ...rpeConfig, [event.target.name]: event.target.value });
	}

	const handleSave = async () => {
		dispatch(loadingActions.show());
		try {
			await rpeService.set(rpeConfig);
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
		<Frame title="Reset Password Email">
			<Grid container spacing={1} alignItems="stretch">
				<Grid item xs={12} md={12}>
					<TextField name="subject" label="Smtp server" value={rpeConfig.subject} type="text" onChange={handleChange} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						name="content"
						multiline
						rows={16}
						label="Port"
						value={rpeConfig.content}
						type="text"
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<div dangerouslySetInnerHTML={{ __html: rpeConfig.content }}></div>
				</Grid>
				<Grid item xs={12} md={6}>
					<IconButton text="Lưu lại" icon="save" variant="contained" onClick={handleSave} />
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption">
						{`{FullName}: Họ tên người gửi | {Link}: Đường dẫn reset password`}
					</Typography>
				</Grid>
			</Grid>
		</Frame>
	)
}
