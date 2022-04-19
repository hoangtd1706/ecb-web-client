import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	Grid,
	Typography,
	Paper,
} from '@material-ui/core';
import { red, amber, blue } from '@material-ui/core/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import {
	Frame,
	TagInfo,
	DataTable,
	DataColumnType,
	DownloadButton,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../../core';

import format from '../../../../configs/format';
import packageService, { PackageModel, ItemModel } from '../../services/package';
import userService from '../../services/user';

import Vendors from './Vendors';

type Data = ItemModel & {
	infoCol: JSX.Element,
	quantityCol: JSX.Element,
	noteCol: JSX.Element,
	deliveryCol: JSX.Element,
}

const columns: DataColumnType<Data>[] = [
	{ id: 'no', label: 'STT', numeric: false, sortable: false },
	{ id: 'infoCol', label: 'Hạng mục', numeric: false, sortable: false },
	{ id: 'quantityCol', label: 'Số lượng', numeric: false, sortable: false },
	{ id: 'noteCol', label: 'Ghi chú', numeric: false, sortable: false },
	{ id: 'deliveryCol', label: 'Thời gian giao hàng', numeric: false, sortable: false },
];

const initialState: PackageModel = {
	attachments: [],
	begin: new Date(),
	code: '',
	status: 0,
	description: '',
	end: new Date(),
	isInternal: false,
	items: [],
	name: '',
	vendors: [],
}

type PackageStatusType = {
	text: string;
	icon: IconName;
	color: string;
}

export default function PackageDetail(): JSX.Element {
	const { packageCode }: never = useParams();
	const dispatch: AppDispatch = useDispatch();

	const [packageDetail, setPackageDetail] = React.useState<PackageModel>(initialState);
	const [isAuditor, setIsAuditor] = React.useState<boolean>(false);

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setPackageDetail(await packageService.get(packageCode));
			setIsAuditor(await userService.checkRolePermission('AUDITOR_ROLE'));
		}
		catch {
			setPackageDetail(initialState);
			setIsAuditor(false);
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	}

	const actionsButton: JSX.Element[] = [
	];

	const renderData = (data: ItemModel[]): Data[] => {
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
			}

			return row;
		});
	}

	const getStatusProps = (status: number): PackageStatusType => {
		switch (status) {
			case 0:
				return { text: 'Mới', icon: 'star', color: red[700] };
			case 1:
				return { text: 'Đang mở', icon: 'spinner', color: amber[700] };
			case 2:
				return { text: 'Đã đóng', icon: 'check-circle', color: blue[700] };
			default:
				return { text: 'Không xác định', icon: 'exclamation-circle', color: '' };
		}
	}

	React.useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packageCode]);

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Frame
					title={packageDetail.isInternal ? "Đấu thầu nội bộ" : "Đấu thầu bình thường"}
				>
					<Grid container spacing={1}>
						<Grid item xs={12} md={6}>
							<Typography variant="caption">Mã số gói thầu</Typography>
							<Typography variant="subtitle2">
								{`${packageDetail.code} - Trạng thái: `}
								<FontAwesomeIcon
									icon={getStatusProps(packageDetail.status).icon}
									color={getStatusProps(packageDetail.status).color}
								/>
								{` ${getStatusProps(packageDetail.status).text} `}
								{packageDetail.status === 2 && (isAuditor || !packageDetail.isInternal) && (
									<DownloadButton
										label="Tải tổng hợp chào giá"
										filename={`${packageDetail.code} - Quotations Report.xlsx`}
										url={`/api/bidding/packages/getExcelReport/${packageDetail.code}`}
									/>
								)}
							</Typography>
						</Grid>
						<TagInfo title="Tên gói thầu" content={packageDetail.name} />
						<TagInfo
							title="Thời gian mở thầu"
							content={format.formatDate(new Date(packageDetail.begin), 'hh:mm dd/MM/yyyy')}
						/>
						<TagInfo
							title="Thời gian đóng thầu"
							content={format.formatDate(new Date(packageDetail.end), 'hh:mm dd/MM/yyyy')}
						/>
						<Grid item xs={12}>
							<Typography variant="caption">Mô tả</Typography>
							<Paper style={{ padding: '8px' }} variant="outlined">
								<div dangerouslySetInnerHTML={{ __html: packageDetail.description }}></div>
							</Paper>
						</Grid>
						<Grid xs={12} item>
							<Typography variant="caption">Tài liệu đính kèm</Typography>
							{packageDetail.attachments.map((a, index) => (
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
											url={`/api/bidding/packages/${packageDetail.code}/attachments/${a.id}`}
										/>
									</Grid>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Frame>
			</Grid>
			<Grid item xs={12}>
				<Vendors
					packageCode={packageDetail.code}
					canViewData={isAuditor || !packageDetail.isInternal}
					packageItems={packageDetail.items}
					isClosedPackage={packageDetail.status === 2}
					vendors={packageDetail.vendors}
				/>
			</Grid>
			<Grid item xs={12}>
				<DataTable
					title="Danh sách vật tư, dịch vụ"
					columns={columns}
					data={renderData(packageDetail.items)}
					actions={actionsButton}
					initialOrderBy="no"
				/>
			</Grid>
		</Grid>
	)
}
