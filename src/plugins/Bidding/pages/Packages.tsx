import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { red } from '@material-ui/core/colors';
import {
	IconButton,
	DataTable,
	DataColumnType,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import packageService, { PackageModel } from '../services/package';

import format from '../../../configs/format';

type Data = PackageModel & {
	action: JSX.Element,
}

const formatIsInternal = (value: Data) => {
	if (value.isInternal) {
		return (
			<>
				<FontAwesomeIcon
					icon="shield-alt"
					color={red[700]}
				/>
				Nội bộ
			</>
		)
	}
	else {
		return '';
	}
}

const formatBegin = (value: Data) => format.formatDate(new Date(value.begin), 'dd/MM/yyyy - hh:mm');
const formatEnd = (value: Data) => format.formatDate(new Date(value.end), 'dd/MM/yyyy - hh:mm');

const columns: DataColumnType<Data>[] = [
	{ id: 'code', label: 'Mã', numeric: false, sortable: true },
	{ id: 'name', label: 'Tên gói thầu', numeric: false, sortable: false },
	{ id: 'isInternal', label: 'Loại', numeric: false, sortable: true, format: formatIsInternal },
	{ id: 'begin', label: 'Mở thầu', numeric: false, sortable: true, format: formatBegin },
	{ id: 'end', label: 'Đóng thầu', numeric: false, sortable: true, format: formatEnd },
	{ id: 'action', label: '', numeric: false, sortable: false },
];

export default function Packages(): JSX.Element {
	const { status }: never = useParams();
	const history = useHistory();
	const dispatch: AppDispatch = useDispatch();

	const [packages, setPackages] = React.useState<PackageModel[]>([]);
	const [title, setTitle] = React.useState<string>('Danh sách gói thầu');

	const actionsButton = [
		<IconButton
			key={1}
			tooltip="Làm mới danh sách"
			text="Làm mới"
			icon="sync-alt"
			color="primary"
			onClick={() => { refresh(); }}
		/>,
	];

	const renderData = (data: PackageModel[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
				action: (
					<>
						<IconButton
							tooltip="Xem chi tiết gói thầu"
							text="Xem"
							icon="info-circle"
							color="success"
							onClick={() => { history.push(`/bidding/expert/package/${item.code}`) }}
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
			setPackages(await packageService.getAll(status));
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

		switch (status) {
			case 'new':
				setTitle('Danh sách gói thầu mới');
				break;
			case 'opening':
				setTitle('Danh sách gói thầu đang mở');
				break;
			case 'closed':
				setTitle('Danh sách gói thầu đã đóng');
				break;
			default:
				break;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	return (
		<DataTable
			title={title}
			columns={columns}
			data={renderData(packages)}
			actions={actionsButton}
			initialOrderBy="begin"
		/>
	)
}
