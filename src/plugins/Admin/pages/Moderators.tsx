import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	IconButton,
	FormDialog,
	TextField,
	DataTable,
	DataColumnType,
} from '@nvdunginest/emis-mui';

import moderatorService, { ModeratorModel } from '../services/moderator';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

type Data = ModeratorModel & {
	action: JSX.Element,
}

const columns: DataColumnType<Data>[] = [
	{ id: 'userNumber', label: 'Mã số', numeric: false, sortable: true },
	{ id: 'role', label: 'Role', numeric: false, sortable: true },
	{ id: 'action', label: '', numeric: false, sortable: false },
];

export default function Moderators(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();
	const { moduleName }: never = useParams();

	const [showForm, setShowForm] = React.useState(false);

	const [moderators, setModerators] = React.useState<ModeratorModel[]>([]);
	const [number, setNumber] = React.useState<string>('');

	const handleCloseForm = () => {
		setShowForm(false);
	};

	const handleOpenCreateForm = () => {
		setNumber('');
		setShowForm(true);
	};

	const handleSubmit = async () => {
		setShowForm(false);
		dispatch(loadingActions.show());
		try {
			await moderatorService.createModerator(moduleName, number);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	};

	const handleRemove = async (userNumber: string) => {
		dispatch(loadingActions.show());
		try {
			await moderatorService.removeModerator(moduleName, userNumber);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	}

	const actionsButton = [
		<IconButton
			key={1}
			tooltip="Thêm quản lý mới"
			text="Thêm"
			icon="plus"
			color="primary"
			hideTitleOnMobile
			onClick={handleOpenCreateForm}
		/>,
	];

	const renderData = (data: ModeratorModel[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
				action: (
					<>
						<IconButton
							tooltip="Xóa quản lý"
							text="Xóa"
							icon="trash-alt"
							color="danger"
							hideTitleOnMobile
							onClick={() => { handleRemove(item.userNumber); }}
						/>
					</>
				)
			}

			return row;
		});
	}

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setModerators((await moderatorService.getModerators(moduleName)).filter(x=>x.role==='MOD_ROLE'));
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
	}, [moduleName]);

	return (
		<>
			<FormDialog
				title="Thêm quản lý"
				open={showForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
			>
				<TextField
					name="number"
					label="Mã số nhân viên"
					type="text"
					value={number}
					required
					onChange={(event) => { setNumber(event.target.value); }}
				/>
			</FormDialog>
			<DataTable
				title={moduleName}
				columns={columns}
				data={renderData(moderators)}
				actions={actionsButton}
				initialOrderBy="userNumber"
			/>
		</>
	)
}
