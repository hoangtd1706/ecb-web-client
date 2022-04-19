import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
	IconButton,
	DataTable,
	DataColumnType,
} from '@nvdunginest/emis-mui';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import format from '../../../configs/format';

import contractService, { ContractModel } from '../services/contract';

type Data = ContractModel & {
	dateString: string;
	action: JSX.Element;
}

const columns: DataColumnType<Data>[] = [
	{ id: 'contractNumber', label: 'Số hợp đồng', numeric: false, sortable: true },
	{ id: 'projectName', label: 'Dự án', numeric: false, sortable: true },
	{ id: 'vendorName', label: 'Nhà cung cấp', numeric: false, sortable: true },
	{ id: 'dateString', label: 'Ngày tạo', numeric: false, sortable: true },
	{ id: 'action', label: '', numeric: false, sortable: false },
];

function getTableTitle(status: string): string {
	switch (status) {
		case "processing":
			return "Hợp đồng đang xử lý";
		case "submitted":
			return "Hợp đồng chờ phê duyệt";
		case "waiting":
			return "Hợp đồng chờ mở lại";
		default:
			return "Hợp đồng đã phê duyệt";
	}
}

export default function MyContracts(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();
	const { status }: never = useParams();

	const [contracts, setContracts] = React.useState<ContractModel[]>([]);

	const actionsButton = [
		<IconButton
			key={1}
			tooltip="Làm mới danh sách hợp đồng"
			text="Làm mới"
			icon="sync-alt"
			color="primary"
			onClick={() => { refresh(); }}
		/>,
	];

	const renderData = (data: ContractModel[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
				dateString: format.formatDate(new Date(item.createdDate), 'dd/MM/yyyy'),
				action:
					<Link
						to={`/b-contract/contracts/${item.contractNumber}`}
						target="_blank"
						style={{ textDecoration: 'none' }}
					>
						<IconButton
							tooltip="Xem chi tiết hợp đồng"
							text="Xem"
							icon="info-circle"
							color="primary"
						/>
					</Link>,
			}

			return row;
		});
	}

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setContracts(await contractService.getMyContractList(status));
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
	}, [status]);

	return (
		<DataTable
			title={getTableTitle(status)}
			columns={columns}
			data={renderData(contracts)}
			actions={actionsButton}
			initialOrderBy="contractNumber"
		/>
	)
}
