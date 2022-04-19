import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Grid,
	Switch,
	Typography,
} from '@material-ui/core';
import {
	Frame,
} from '@nvdunginest/emis-mui';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import configService, { PluginModeModel } from '../services/pluginConfig';

export default function Settings(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [allowAll, setAllowAll] = React.useState<boolean>(false);

	const handleSetAllowAll = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const model: PluginModeModel = {
			allowAll: event.target.checked
		}

		dispatch(loadingActions.show());
		try {
			await configService.setPluginMode(model);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	};

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setAllowAll(await configService.getPluginMode());
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
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Frame title="Cài đặt hiển thị">
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<Typography variant="subtitle2">Hiển thị với tất cả người dùng</Typography>
								<Switch
									checked={allowAll}
									color="primary"
									onChange={handleSetAllowAll}
									inputProps={{ 'aria-label': 'primary checkbox' }}
								/>
							</div>
						</Grid>
					</Grid>
				</Frame>
			</Grid>
		</Grid>
	)
}
