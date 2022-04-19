import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
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

import moduleService, { ModuleModel } from '../services/module';
import supporterService, { SupporterModel } from '../services/supporter';

const initialState: ModuleModel = {
	id: 0,
	category: '',
	name: '',
	description: '',
}

export default function Supporters(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();
	const { moduleId }: never = useParams();
	const [module, setModule] = React.useState<ModuleModel>(initialState);
	const [supporters, setSupporters] = React.useState<SupporterModel[]>([]);
	const [keyword, setKeyword] = React.useState<string>('');

	const refresh = () => {
		dispatch(loadingActions.show());
		Promise.all([moduleService.get(moduleId), supporterService.getAll(moduleId)])
			.then((res) => {
				setModule(res[0]);
				setSupporters(res[1]);
			})
			.catch(() => {
				dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
			})
			.finally(() => {
				dispatch(loadingActions.hide());
			});
	}

	const handleAddSupporter = async () => {
		if (keyword === '') {
			dispatch(alertActions.show(alertMessage.REQUIRED_FAILURE, 'error'));
		}
		else {
			dispatch(loadingActions.show());
			try {
				await supporterService.create(moduleId, keyword);
				dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
				refresh();
			}
			catch {
				dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
				dispatch(loadingActions.hide());
			}
		}
	}

	const handleRemoveSupporter = async (userNumber: string) => {
		dispatch(loadingActions.show());
		try {
			await supporterService.remove(moduleId, userNumber);
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
		<Frame title={module.name}>
			<Grid container alignItems="flex-end" spacing={1}>
				<Grid item xs={12} md={6}>
					<TextField
						label="Mã số nhân viên/Họ tên/Email"
						required
						type="text"
						value={keyword}
						onChange={(event) => { setKeyword(event.target.value); }}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<IconButton
						icon="user-astronaut"
						color="primary"
						text="Thêm người hỗ trợ"
						variant="contained"
						onClick={() => { handleAddSupporter(); }}
					/>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					{supporters.map((supporter, index) => (
						<Chip
							style={{ margin: '4px' }}
							key={index}
							label={`${supporter.userNumber}-${supporter.fullName}`}
							onDelete={() => { handleRemoveSupporter(supporter.userNumber) }}
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
