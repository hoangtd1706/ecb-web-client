import React from 'react';
import {
	Grid,
} from '@material-ui/core';

import format from '../../../../configs/format';
import {
	Frame,
	TagInfo,
} from '@nvdunginest/emis-mui';

import { ContractDetailContext } from '../../stores/ContractDetailStore';
import CreateRequest from './CreateRequest';
import CancelRequest from './CancelRequest';
import CheckRequest from './CheckRequest';
import RejectRequest from './RejectRequest';
import ApproveRequest from './ApproveRequest';
import UpdateNetPrice from './UpdateNetPrice';
import Attachment from './Attachment';

export default function ContractHeader(): JSX.Element {
	const contract = React.useContext(ContractDetailContext).state.contract;

	return (
		<Frame title="Thông tin hợp đồng">
			<Grid container alignItems="stretch" spacing={1}>
				<TagInfo title="Số hợp đồng" content={contract.contractNumber} />
				<TagInfo title="Loại hợp đồng" content={contract.contractType === 'D' ? "Dự án" : "Nguyên tắc"} />
				<TagInfo title="Dự án" content={`${contract.projectCode}-${contract.projectName}`} />
				<TagInfo title="Nhà cung cấp" content={`${contract.vendorCode}-${contract.vendorName}`} />
				<TagInfo
					title="Giá trị hợp đồng"
					content={`${format.formatMoney(contract.contractValue)} VND`}
				/>
				<TagInfo title="Điều khoản thanh toán" content={contract.paymentTerm} />
				<TagInfo
					title="Ngày tạo hợp đồng"
					content={format.formatDate(new Date(contract.createdDate), 'dd/MM/yyyy')}
				/>
				<TagInfo title="Người tạo hợp đồng" content={`${contract.createdBy}-${contract.createdByFullName}`} />
				<Grid item xs={12} md={6} container spacing={1}>
					<CreateRequest />
					<CancelRequest />
					<CheckRequest />
					<RejectRequest />
					<ApproveRequest />
					<UpdateNetPrice />
					<Attachment />
				</Grid>
			</Grid>
		</Frame>
	)
}