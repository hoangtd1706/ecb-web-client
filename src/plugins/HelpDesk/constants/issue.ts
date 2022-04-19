import { IconName } from '@fortawesome/fontawesome-svg-core';
import { PaletteType } from '@nvdunginest/emis-mui';

export type TagType = {
	text: string;
	variant: PaletteType;
}

export type StatusType = {
	text: string;
	icon: IconName;
	color: PaletteType;
}

export type ActionType = {
	name: string;
	apiUrl: string;
	text: string;
	needContent: boolean;
	color: PaletteType;
	icon: IconName;
}

const severity: TagType[] = [
	{
		text: 'Không đặt',
		variant: 'secondary',
	},
	{
		text: 'Nhẹ',
		variant: 'success',
	},
	{
		text: 'Bình thường',
		variant: 'info',
	},
	{
		text: 'Nghiêm trọng',
		variant: 'warning',
	},
	{
		text: 'Rất nghiêm trọng',
		variant: 'danger',
	},
];

const priority: TagType[] = [
	{
		text: 'Không đặt',
		variant: 'secondary',
	},
	{
		text: 'Thấp',
		variant: 'success',
	},
	{
		text: 'Bình thường',
		variant: 'info',
	},
	{
		text: 'Cao',
		variant: 'warning',
	},
	{
		text: 'Cần gấp',
		variant: 'danger',
	},
];

const actions: ActionType[] = [
	{
		name: 'Tạo mới',
		apiUrl: 'create',
		text: 'đã tạo issue',
		needContent: false,
		color: 'danger',
		icon: 'exclamation-circle',
	},
	{
		name: 'Tiếp nhận',
		apiUrl: 'assign',
		text: 'đã tiếp nhận',
		needContent: false,
		color: 'info',
		icon: 'sync-alt',
	},
	{
		name: 'Đã xử lý',
		apiUrl: 'resolve',
		text: 'đã xử lý',
		needContent: false,
		color: 'primary',
		icon: 'info-circle',
	},
	{
		name: 'Đóng issue',
		apiUrl: 'close',
		text: 'đã đóng issue',
		needContent: false,
		color: 'success',
		icon: 'check-circle',
	},
	{
		name: 'Báo lỗi',
		apiUrl: 'reject',
		text: 'đã báo lỗi',
		needContent: true,
		color: 'warning',
		icon: 'exclamation-triangle',
	},
	{
		name: 'Trả lại',
		apiUrl: 'giveBack',
		text: 'đã trả lại',
		needContent: true,
		color: 'warning',
		icon: 'undo-alt',
	},
	{
		name: 'Comment',
		apiUrl: 'comment',
		text: 'đã comment',
		needContent: true,
		color: 'secondary',
		icon: 'comments',
	},
	{
		name: 'Hủy issue',
		apiUrl: 'cancel',
		text: 'đã hủy',
		needContent: false,
		color: 'danger',
		icon: 'times-circle',
	},
	{
		name: 'Gửi phê duyệt',
		apiUrl: 'createRequest',
		text: 'đã gửi phê duyệt',
		needContent: true,
		color: 'primary',
		icon: 'paper-plane',
	},
	{
		name: 'Phê duyệt',
		apiUrl: 'approve',
		text: 'đã phê duyệt',
		needContent: false,
		color: 'success',
		icon: 'signature',
	},
	{
		name: 'Từ chối',
		apiUrl: 'deny',
		text: 'đã từ chối phê duyệt',
		needContent: true,
		color: 'danger',
		icon: 'times',
	},
	{
		name: 'Đính kèm',
		apiUrl: 'attach',
		text: 'đã đính kèm tập tin',
		needContent: false,
		color: 'dark',
		icon: 'paperclip',
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
	{
		text: 'Chờ phê duyệt',
		icon: 'hourglass-half',
		color: 'warning',
	},
]

export default {
	severity,
	priority,
	status,
	actions,
}