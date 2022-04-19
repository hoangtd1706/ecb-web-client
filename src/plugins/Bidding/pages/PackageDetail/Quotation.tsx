import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Grid,
	Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Frame,
	DataTable,
	DataColumnType,
	DownloadButton,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
} from '../../../../core';

import format from '../../../../configs/format';
import packageService, { QuotationModel, ItemModel } from '../../services/package';

type ItemState = ItemModel & {
	price: number;
}

type Data = ItemState & {
	infoCol: JSX.Element,
	quantityCol: JSX.Element,
	noteCol: JSX.Element,
	deliveryCol: JSX.Element,
	priceCol: JSX.Element,
}

const columns: DataColumnType<Data>[] = [
	{ id: 'no', label: 'STT', numeric: false, sortable: false },
	{ id: 'infoCol', label: 'Hạng mục', numeric: false, sortable: false },
	{ id: 'quantityCol', label: 'Số lượng', numeric: false, sortable: false },
	{ id: 'noteCol', label: 'Ghi chú', numeric: false, sortable: false },
	{ id: 'deliveryCol', label: 'Thời gian giao hàng', numeric: false, sortable: false },
	{ id: 'priceCol', label: 'Đơn giá', numeric: false, sortable: false },
];

const initialQuotationState: QuotationModel = {
	submitted: false,
	items: [],
	attachments: [],
}

type Props = {
	packageCode: string;
	vendorCode: string;
	packageItems: ItemModel[];
}

export default function Quotation({
	packageCode,
	vendorCode,
	packageItems,
}: Props): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [quotation, setQuotation] = React.useState<QuotationModel>(initialQuotationState);
	const [items, setItems] = React.useState<ItemState[]>([]);

	const refresh = async () => {
		try {
			const data = await packageService.getQuotation(packageCode, vendorCode);
			setQuotation(data);
			setItems(packageItems.map(packageItem => {
				const quotationItem = data.items.find(x => x.itemId === packageItem.id);
				if (quotationItem !== undefined) {
					return ({ ...packageItem, price: quotationItem.price });
				}
				else {
					return ({ ...packageItem, price: 0 });
				}
			}));
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
	}

	const actionsButton: JSX.Element[] = [
	];

	const renderData = (data: ItemState[]): Data[] => {
		return data.map(item => {
			const row: Data = {
				...item,
				infoCol: (
					<div>
						<Typography variant="subtitle2">{item.description}</Typography>
						<Typography variant="caption">{item.code}</Typography>
					</div>
				),
				quantityCol: (
					<div>
						<Typography variant="subtitle2">
							{`${format.formatMoney(item.quantity, 3)} ${item.unit}`}
						</Typography>
						<Typography variant="caption">
							{`${format.formatMoney(item.optionQuantity, 3)} ${item.optionUnit}`}
						</Typography>
					</div>
				),
				noteCol: (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						{item.spec !== null && <Typography variant="caption">{`Spec: ${item.spec}`}</Typography>}
						{item.spec !== null && <Typography variant="caption">{`Ghi chú: ${item.note}`}</Typography>}
					</div>
				),
				deliveryCol: (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Typography variant="caption">
							{`Từ: ${format.formatDate(new Date(item.begin), 'dd/MM/yyyy')}`}
						</Typography>
						<Typography variant="caption">
							{`Đến: ${format.formatDate(new Date(item.end), 'dd/MM/yyyy')}`}
						</Typography>
					</div>
				),
				priceCol: (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Typography variant="subtitle2">
							{format.formatMoney(item.price, 3)}
						</Typography>
						<Typography variant="caption">
							{`VND/1 ${item.unit}`}
						</Typography>
					</div>
				)
			}

			return row;
		});
	}

	React.useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packageCode, vendorCode]);

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<DataTable
					title="Bảng chào giá"
					columns={columns}
					data={renderData(items)}
					actions={actionsButton}
					initialOrderBy="no"
				/>
			</Grid>
			<Grid item xs={12}>
				<Frame title="Tài liệu đính kèm chào giá">
					{quotation.attachments.map((a, index) => (
						<Grid key={index} container spacing={1}>
							<Grid item>
								<FontAwesomeIcon icon={{ iconName: 'check-square', prefix: 'far' }} />
							</Grid>
							<Grid item>
								<Typography variant="subtitle2">{a.fileName}</Typography>
							</Grid>
							<Grid item>
								<DownloadButton
									filename={a.fileName}
									url={`/api/bidding/packages/${packageCode}/attachments/getQuotationFile/${vendorCode}/${a.id}`}
								/>
							</Grid>
						</Grid>
					))}
				</Frame>
			</Grid>
		</Grid>
	)
}
