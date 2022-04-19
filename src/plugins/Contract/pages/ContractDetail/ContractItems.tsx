import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Hidden,
	Grid,
} from '@material-ui/core';

import format from '../../../../configs/format';
import { ItemModel, SubItemModel } from '../../services/contract';
import { ContractDetailContext } from '../../stores/ContractDetailStore';
import {
	Frame,
} from '@nvdunginest/emis-mui';

const useStyles = makeStyles(() => ({
	main: {
		lineHeight: 1,
	},
	sub: {
		lineHeight: 1.4,
		fontSize: '0.7rem',
		fontStyle: 'italic',
	},
	head: {
		color: '#fff',
		backgroundColor: '#444',
		textTransform: 'uppercase',
		fontSize: '0.8rem',
	},
	warning: {
		backgroundColor: '#f59542',
	},
	danger: {
		backgroundColor: '#f54242',
	},
}));

export default function ContractItems(): JSX.Element {
	const classes = useStyles();
	const { formatMoney } = format;
	const contract = React.useContext(ContractDetailContext).state.contract;

	const getItemLineFormatText = (item: ItemModel): string => {
		if (item.isService) {
			return '';
		}
		else {
			if (item.planPrice <= 0) {
				return classes.warning;
			}
			if (item.planPrice < item.price) {
				return classes.danger;
			}

			return '';
		}
	}

	const getSubItemLineFormatText = (item: SubItemModel): string => {
		if (item.planPrice <= 0) {
			return classes.warning;
		}
		if (item.planPrice < item.price) {
			return classes.danger;
		}

		return '';
	}

	return (
		<Frame title="Thông tin chi tiết hợp đồng" noPadding>
			<Hidden smDown implementation="css">
				<Table size="small" style={{ padding: '8px' }}>
					<TableHead>
						<TableRow>
							<TableCell className={classes.head} rowSpan={2} colSpan={2}>Hạng mục</TableCell>
							<TableCell className={classes.head} align="right">Khối lượng</TableCell>
							<TableCell className={classes.head} align="right">Đơn giá HĐ</TableCell>
							<TableCell className={classes.head} align="right">Đơn giá KH</TableCell>
							{(contract.status === 'P' || contract.status === 'S') && (
								<TableCell className={classes.head} align="right">Đơn giá Net</TableCell>
							)}
							<TableCell className={classes.head} align="right">Thành tiền</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{contract.items.map((item, index) => (
							<React.Fragment key={index}>
								<TableRow hover>
									<TableCell colSpan={2}>
										<Typography className={classes.main} variant="subtitle2">{item.text}</Typography>
										<Typography className={classes.sub} variant="caption">{item.code === '' ? '-' : item.code}</Typography>
									</TableCell>
									<TableCell align="right">
										<Typography className={classes.main} variant="subtitle2">{formatMoney(item.quantity)}</Typography>
										<Typography className={classes.sub} variant="caption">{item.unit}</Typography>
									</TableCell>
									<TableCell className={getItemLineFormatText(item)} align="right">
										<Typography className={classes.main} variant="subtitle2">{formatMoney(item.price)}</Typography>
										<Typography className={classes.sub} variant="caption">{`VND/${item.per} ${item.unit}`}</Typography>
									</TableCell>
									<TableCell className={getItemLineFormatText(item)} align="right">
										<Typography className={classes.main} variant="subtitle2">
											{item.planPrice > 0 ? formatMoney(item.planPrice) : '-'}
										</Typography>
										<Typography className={classes.sub} variant="caption">{`VND/${item.per} ${item.unit}`}</Typography>
									</TableCell>
									{(contract.status === 'P' || contract.status === 'S') && (
										<TableCell className={getItemLineFormatText(item)} align="right">
											<Typography className={classes.main} variant="subtitle2">
												{item.netPrice > 0 ? formatMoney(item.netPrice) : '-'}
											</Typography>
											<Typography className={classes.sub} variant="caption">{`VND/${item.per} ${item.unit}`}</Typography>
										</TableCell>
									)}
									<TableCell align="right">
										<Typography className={classes.main} variant="subtitle2">
											{formatMoney(item.price * item.quantity / item.per)}
										</Typography>
										<Typography className={classes.sub} variant="caption">VND</Typography>
									</TableCell>
								</TableRow>
								{item.isService && item.subItems.map((subItem, subIndex) => (
									<TableRow key={subIndex} hover>
										<TableCell style={{ width: '8px', padding: 0, backgroundColor: 'red' }}></TableCell>
										<TableCell>
											<Typography className={classes.main} variant="subtitle2">{subItem.text}</Typography>
											<Typography className={classes.sub} variant="caption">{subItem.code === '' ? '-' : subItem.code}</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography className={classes.main} variant="subtitle2">{formatMoney(subItem.quantity)}</Typography>
											<Typography className={classes.sub} variant="caption">{subItem.unit}</Typography>
										</TableCell>
										<TableCell className={getSubItemLineFormatText(subItem)} align="right">
											<Typography className={classes.main} variant="subtitle2">{formatMoney(subItem.price)}</Typography>
											<Typography className={classes.sub} variant="caption">{`VND/${subItem.per} ${subItem.unit}`}</Typography>
										</TableCell>
										<TableCell className={getSubItemLineFormatText(subItem)} align="right">
											<Typography className={classes.main} variant="subtitle2">
												{subItem.planPrice > 0 ? formatMoney(subItem.planPrice) : '-'}
											</Typography>
											<Typography className={classes.sub} variant="caption">{`VND/${subItem.per} ${subItem.unit}`}</Typography>
										</TableCell>
										{(contract.status === 'P' || contract.status === 'S') && (
											<TableCell className={getSubItemLineFormatText(subItem)} align="right">
												<Typography className={classes.main} variant="subtitle2">
													{subItem.netPrice > 0 ? formatMoney(subItem.netPrice) : '-'}
												</Typography>
												<Typography className={classes.sub} variant="caption">{`VND/${subItem.per} ${subItem.unit}`}</Typography>
											</TableCell>
										)}
										<TableCell align="right">
											<Typography className={classes.main} variant="subtitle2">
												{formatMoney(subItem.price * subItem.quantity / subItem.per)}
											</Typography>
											<Typography className={classes.sub} variant="caption">VND</Typography>
										</TableCell>
									</TableRow>
								))}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</Hidden>
			<Hidden mdUp implementation="css">
				<Grid container spacing={2} style={{ padding: '8px' }}>
					{contract.items.map((item, index) => (
						<React.Fragment key={index}>
							<Grid container item spacing={1}>
								<Grid item xs={12}>
									<Typography className={classes.main} variant="subtitle2">{item.text}</Typography>
									<Typography className={classes.sub} variant="caption">{item.code === '' ? '-' : item.code}</Typography>
								</Grid>
								<Grid item container xs={12} spacing={1} alignItems="flex-end">
									<Grid item xs={3}>
										<Typography className={classes.sub} variant="caption">Khối lượng</Typography>
									</Grid>
									<Grid item xs={5}>
										<Typography align="right" className={classes.main} variant="subtitle2">{formatMoney(item.quantity)}</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography className={classes.sub} variant="caption">{item.unit}</Typography>
									</Grid>
								</Grid>
								<Grid className={getItemLineFormatText(item)} item container xs={12} spacing={1} alignItems="flex-end">
									<Grid item xs={3}>
										<Typography className={classes.sub} variant="caption">Đơn giá HĐ</Typography>
									</Grid>
									<Grid item xs={5}>
										<Typography align="right" className={classes.main} variant="subtitle2">
											{formatMoney(item.price)}
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography className={classes.sub} variant="caption">
											{`VND/${item.per} ${item.unit}`}
										</Typography>
									</Grid>
								</Grid>
								<Grid className={getItemLineFormatText(item)} item container xs={12} spacing={1} alignItems="flex-end">
									<Grid item xs={3}>
										<Typography className={classes.sub} variant="caption">Đơn giá KH</Typography>
									</Grid>
									<Grid item xs={5}>
										<Typography align="right" className={classes.main} variant="subtitle2">
											{item.planPrice > 0 ? formatMoney(item.planPrice) : '-'}
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography className={classes.sub} variant="caption">
											{`VND/${item.per} ${item.unit}`}
										</Typography>
									</Grid>
								</Grid>
								{(contract.status === 'P' || contract.status === 'S') && (
									<Grid className={getItemLineFormatText(item)} item container xs={12} spacing={1} alignItems="flex-end">
										<Grid item xs={3}>
											<Typography className={classes.sub} variant="caption">Đơn giá Net</Typography>
										</Grid>
										<Grid item xs={5}>
											<Typography align="right" className={classes.main} variant="subtitle2">
												{item.netPrice > 0 ? formatMoney(item.netPrice) : '-'}
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography className={classes.sub} variant="caption">
												{`VND/${item.per} ${item.unit}`}
											</Typography>
										</Grid>
									</Grid>
								)}
								<Grid item container xs={12} spacing={1} alignItems="flex-end">
									<Grid item xs={3}>
										<Typography className={classes.sub} variant="caption">Thành tiền</Typography>
									</Grid>
									<Grid item xs={5}>
										<Typography align="right" className={classes.main} variant="subtitle2">
											{formatMoney(item.price * item.quantity / item.per)}
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography className={classes.sub} variant="caption">
											VND
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							{item.isService && item.subItems.map((subItem, subIndex) => (
								<Grid container item spacing={1} key={subIndex} style={{ paddingLeft: '16px', borderLeft: '12px solid red' }}>
									<Grid item xs={12}>
										<Typography className={classes.main} variant="subtitle2">{subItem.text}</Typography>
										<Typography className={classes.sub} variant="caption">{subItem.code === '' ? '-' : subItem.code}</Typography>
									</Grid>
									<Grid item container xs={12} spacing={1} alignItems="flex-end">
										<Grid item xs={3}>
											<Typography className={classes.sub} variant="caption">Khối lượng</Typography>
										</Grid>
										<Grid item xs={5}>
											<Typography align="right" className={classes.main} variant="subtitle2">{formatMoney(subItem.quantity)}</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography className={classes.sub} variant="caption">{subItem.unit}</Typography>
										</Grid>
									</Grid>
									<Grid className={getSubItemLineFormatText(subItem)} item container xs={12} spacing={1} alignItems="flex-end">
										<Grid item xs={3}>
											<Typography className={classes.sub} variant="caption">Đơn giá HĐ</Typography>
										</Grid>
										<Grid item xs={5}>
											<Typography align="right" className={classes.main} variant="subtitle2">
												{formatMoney(subItem.price)}
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography className={classes.sub} variant="caption">
												{`VND/${subItem.per} ${subItem.unit}`}
											</Typography>
										</Grid>
									</Grid>
									<Grid className={getSubItemLineFormatText(subItem)} item container xs={12} spacing={1} alignItems="flex-end">
										<Grid item xs={3}>
											<Typography className={classes.sub} variant="caption">Đơn giá KH</Typography>
										</Grid>
										<Grid item xs={5}>
											<Typography align="right" className={classes.main} variant="subtitle2">
												{subItem.planPrice > 0 ? formatMoney(subItem.planPrice) : '-'}
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography className={classes.sub} variant="caption">
												{`VND/${subItem.per} ${subItem.unit}`}
											</Typography>
										</Grid>
									</Grid>
									{(contract.status === 'P' || contract.status === 'S') && (
										<Grid className={getSubItemLineFormatText(subItem)} item container xs={12} spacing={1} alignItems="flex-end">
											<Grid item xs={3}>
												<Typography className={classes.sub} variant="caption">Đơn giá Net</Typography>
											</Grid>
											<Grid item xs={5}>
												<Typography align="right" className={classes.main} variant="subtitle2">
													{subItem.netPrice > 0 ? formatMoney(subItem.netPrice) : '-'}
												</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography className={classes.sub} variant="caption">
													{`VND/${subItem.per} ${subItem.unit}`}
												</Typography>
											</Grid>
										</Grid>
									)}
									<Grid item container xs={12} spacing={1} alignItems="flex-end">
										<Grid item xs={3}>
											<Typography className={classes.sub} variant="caption">Thành tiền</Typography>
										</Grid>
										<Grid item xs={5}>
											<Typography align="right" className={classes.main} variant="subtitle2">
												{formatMoney(subItem.price * subItem.quantity / subItem.per)}
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography className={classes.sub} variant="caption">
												VND
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							))}
						</React.Fragment>
					))}
				</Grid>
			</Hidden>
		</Frame >
	)
}