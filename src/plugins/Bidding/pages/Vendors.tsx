import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
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

import vendorService, { VendorModel } from '../services/vendor';

type Data = VendorModel & {
	action: JSX.Element,
}

const columns: DataColumnType<Data>[] = [
	{ id: 'code', label: 'Mã số thuế', numeric: false, sortable: true },
	{ id: 'longTextName', label: 'Nhà cung cấp', numeric: false, sortable: true },
	{ id: 'action', label: '', numeric: false, sortable: false },
];

export default function Vendors(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const { filter }: never = useParams();
	const history = useHistory();

	const [vendors, setVendors] = React.useState<VendorModel[]>([]);

	const actionsButton = [
		<></>,
	];

	const renderData = (data: VendorModel[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
				action: (
					<IconButton
						tooltip="Chi tiết"
						text="Chi tiết"
						icon="info-circle"
						color="success"
						onClick={() => { history.push(`/bidding/admin/vendors/detail/${item.code}`); }}
					/>
				)
			}

			return row;
		});
	}

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			if (filter === 'approved') {
				setVendors(await vendorService.getVendors());
			}
			else {
				setVendors(await vendorService.getRegisterList());
			}
		}
		catch {
			dispatch(loadingActions.hide());
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	}

	React.useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter]);

	return (
		<DataTable
			title={filter === 'approved' ? 'Danh sách nhà cung cấp' : 'Danh sách chờ phê duyệt'}
			columns={columns}
			data={renderData(vendors)}
			actions={actionsButton}
			initialOrderBy="code"
		/>
	)
}
