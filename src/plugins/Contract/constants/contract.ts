import { IconName } from '@fortawesome/fontawesome-svg-core';
import { PaletteType } from '@nvdunginest/emis-mui';

export type StatusType = {
	text: string;
	icon: IconName;
	color: PaletteType;
}

export type ActionType = {
	name: string;
	apiUrl: string;
	text: string;
	color: PaletteType;
	icon: IconName;
}

const actions: ActionType[] = [
	{
		name: 'Tạo yêu cầu',
		apiUrl: 'submit',
		text: 'đã tạo yêu cầu phê duyệt hợp đồng',
		color: 'danger',
		icon: 'exclamation-circle',
	},
	{
		name: 'Hủy yêu cầu',
		apiUrl: 'cancelSubmit',
		text: 'đã hủy bỏ yêu cầu phê duyệt hợp đồng',
		color: 'info',
		icon: 'sync-alt',
	},
	{
		name: 'Xác nhận',
		apiUrl: 'checkSubmit',
		text: 'đã xác nhận hợp đồng',
		color: 'primary',
		icon: 'info-circle',
	},
	{
		name: 'Từ chối',
		apiUrl: 'rejectSubmit',
		text: 'đã từ chối phê duyệt hợp đồng',
		color: 'success',
		icon: 'check-circle',
	},
	{
		name: 'Phê duyệt',
		apiUrl: 'approveSubmit',
		text: 'đã phê duyệt hợp đồng',
		color: 'warning',
		icon: 'exclamation-triangle',
	},
	{
		name: 'Mở lại',
		apiUrl: 'reopen',
		text: 'đã yêu cầu mở lại hợp đồng',
		color: 'warning',
		icon: 'undo-alt',
	},
	{
		name: 'Hủy mở lại',
		apiUrl: 'cancelReopen',
		text: 'đã hủy bỏ yêu cầu mở lại hợp đồng',
		color: 'secondary',
		icon: 'comments',
	},
	{
		name: 'Xác nhận mở lại',
		apiUrl: 'checkReopen',
		text: 'đã xác nhận mở lại hợp đồng',
		color: 'danger',
		icon: 'times-circle',
	},
	{
		name: 'Từ chỗi mở lại',
		apiUrl: 'rejectReopen',
		text: 'đã từ chỗi mở lại hợp đồng',
		color: 'danger',
		icon: 'times-circle',
	},
	{
		name: 'Phê duyệt mở lại',
		apiUrl: 'approveReopen',
		text: 'đã phê duyệt mở lại hợp đồng',
		color: 'danger',
		icon: 'times-circle',
	},
];

const status: StatusType[] = [
	{
		text: 'Issue mới',
		icon: 'exclamation-circle',
		color: 'warning',
	},
	{
		text: 'Issue mới',
		icon: 'exclamation-circle',
		color: 'warning',
	},
	{
		text: 'Đang xử lý',
		icon: 'sync-alt',
		color: 'info',
	},
	{
		text: 'Đã xử lý',
		icon: 'question-circle',
		color: 'primary',
	},
	{
		text: 'Đã đóng',
		icon: 'check-circle',
		color: 'success',
	},
	{
		text: 'Đã hủy',
		icon: 'times-circle',
		color: 'danger',
	},
]

export default {
	status,
	actions,
}