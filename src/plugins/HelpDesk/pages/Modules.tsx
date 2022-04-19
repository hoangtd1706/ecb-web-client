import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	IconButton,
	FormDialog,
	TextField,
	DataTable,
	DataColumnType,
} from '@nvdunginest/emis-mui';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import moduleService, { ModuleModel, AddModuleModel } from '../services/module';

type Data = ModuleModel & {
	action: JSX.Element,
}

const columns: DataColumnType<Data>[] = [
	{ id: 'category', label: 'Nhóm', numeric: false, sortable: true },
	{ id: 'name', label: 'Module', numeric: false, sortable: true },
	{ id: 'description', label: 'Mô tả', numeric: false, sortable: false },
	{ id: 'action', label: '', numeric: false, sortable: false },
];

const initialState: ModuleModel = {
	id: 0,
	category: '',
	name: '',
	description: '',
}

export default function Modules(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();
	const history = useHistory();
	const [showForm, setShowForm] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);

	const [modules, setModules] = React.useState<ModuleModel[]>([]);
	const [item, setItem] = React.useState<ModuleModel>(initialState);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setItem({ ...item, [event.target.name]: event.target.value });
	};

	const handleCloseForm = () => {
		setShowForm(false);
	};

	const handleOpenCreateForm = () => {
		setItem(initialState);
		setIsEdit(false);
		setShowForm(true);
	};

	const handleOpenEditForm = (item: ModuleModel) => {
		setItem(item);
		setIsEdit(true);
		setShowForm(true);
	};

	const handleSubmit = async () => {
		setShowForm(false);
		dispatch(loadingActions.show());
		try {
			if (isEdit) {
				await moduleService.edit(item.id, item);
			}
			else {
				const model: AddModuleModel = {
					name: item.name,
					category: item.category,
					description: item.description,
				};
				await moduleService.create(model);
			}
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
			dispatch(loadingActions.hide());
		}
	};

	const actionsButton = [
		<IconButton
			key={1}
			tooltip="Thêm module mới"
			text="Thêm"
			icon="plus"
			color="primary"
			onClick={handleOpenCreateForm}
		/>,
	];

	const renderData = (data: ModuleModel[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
				action: (
					<>
						<IconButton
							tooltip="Người hỗ trợ"
							text="Hỗ trợ"
							icon="user-astronaut"
							color="primary"
							onClick={() => { history.push(`/help-desk/admin/modules/${item.id}`) }}
						/>
						<IconButton
							tooltip="Chỉnh sửa module"
							text="Sửa"
							icon="edit"
							color="success"
							onClick={() => { handleOpenEditForm(item); }}
						/>
						<IconButton
							tooltip="Xóa module"
							text="Xóa"
							icon="trash-alt"
							color="danger"
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
			setModules(await moduleService.getAll());
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
		<>
			<FormDialog
				title="Thêm/Chỉnh sửa module"
				open={showForm}
				onClose={handleCloseForm}
				onSubmit={handleSubmit}
			>
				<TextField
					name="category"
					label="Nhóm"
					type="text"
					required
					value={item.category}
					onChange={handleChange}
				/>
				<TextField
					name="name"
					label="Tên module"
					type="text"
					required
					value={item.name}
					onChange={handleChange}
				/>
				<TextField
					name="description"
					label="Mô tả"
					type="text"
					value={item.description}
					required
					onChange={handleChange}
				/>
			</FormDialog>
			<DataTable
				title="Module"
				columns={columns}
				data={renderData(modules)}
				actions={actionsButton}
				initialOrderBy="category"
			/>
		</>
	)
}
