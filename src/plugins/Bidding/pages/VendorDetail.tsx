import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {
	Grid,
} from '@material-ui/core';
import {
	Frame,
	TagInfo,
	IconButton,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
	alertMessage,
	loadingActions,
} from '../../../core';

import vendorService, { VendorDetailModel } from '../services/vendor';

const initialState: VendorDetailModel = {
	addresses: [],
	code: '',
	isActive: false,
	longTextName: '',
	shortTextName: '',
}

export default function VendorDetail(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();
	const { code }: never = useParams();
	const history = useHistory();

	const [vendor, setVendor] = React.useState<VendorDetailModel>(initialState);

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setVendor(await vendorService.getDetail(code));
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	}

	const handleApprove = async () => {
		dispatch(loadingActions.show());
		try {
			await vendorService.approve(code);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(loadingActions.hide());
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
		}
	}

	const handleReject = async () => {
		dispatch(loadingActions.show());
		try {
			await vendorService.reject(code);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			dispatch(loadingActions.hide());
			history.push('/bidding/admin/vendors/list/waiting');
		}
		catch {
			dispatch(loadingActions.hide());
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
		}
	}

	React.useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code]);

	return (
		<Frame title="Thông tin nhà cung cấp">
			<Grid container spacing={1}>
				<TagInfo title="Mã số thuế" content={vendor.code} />
				<TagInfo title="Tên nhà cung cấp" content={vendor.longTextName} />
				<TagInfo title="Tên rút gọn" content={vendor.shortTextName} />
				<TagInfo title="Trạng thái" content={vendor.isActive ? 'Đã phê duyệt' : 'Chờ phê duyệt...'} />
				{vendor.addresses.filter(x => x.addressType === 1).map((addr, index) => (
					<TagInfo key={index} title={`Địa chỉ ${index + 1}`} content={addr.data} />
				))}
				{vendor.addresses.filter(x => x.addressType === 2).map((addr, index) => (
					<TagInfo key={index} title={`Email ${index + 1}`} content={addr.data} />
				))}
				{vendor.addresses.filter(x => x.addressType === 3).map((addr, index) => (
					<TagInfo key={index} title={`Điện thoại liên hệ ${index + 1}`} content={addr.data} />
				))}
				{!vendor.isActive && (
					<Grid xs={12} container item spacing={1}>
						<Grid item>
							<IconButton
								variant="contained"
								color="success"
								icon="check-circle"
								text="Phê duyệt"
								onClick={() => { handleApprove(); }}
							/>
						</Grid>
						<Grid item>
							<IconButton
								variant="contained"
								color="danger"
								icon="ban"
								text="Từ chối"
								onClick={() => { handleReject(); }}
							/>
						</Grid>
					</Grid>
				)}
			</Grid>
		</Frame>
	)
}
