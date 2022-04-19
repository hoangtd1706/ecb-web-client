import React from 'react';
import { green, cyan } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import {
	Typography,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Accordion as MuiAccordion,
	AccordionSummary as MuiAccordionSummary,
	AccordionDetails as MuiAccordionDetails,
	Grid,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
	Frame,
} from '@nvdunginest/emis-mui';

import format from '../../../../configs/format';
import { ContractDetailContext } from '../../stores/ContractDetailStore';

const Accordion = withStyles({
	root: {
		border: '1px solid rgba(0, 0, 0, .125)',
		boxShadow: 'none',
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			margin: 'auto',
		},
	},
	expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
	root: {
		color: '#fff',
		fontStyle: 'uppercase',
		borderBottom: '1px solid rgba(0, 0, 0, .125)',
		marginBottom: -1,
		minHeight: 40,
		'&$expanded': {
			minHeight: 40,
		},
	},
	content: {
		margin: 0,
		'& .MuiTypography-body1': {
			fontSize: '0.9rem',
		},
		'&$expanded': {
			margin: '0',
		},
	},
	expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(() => ({
	root: {
		padding: 0,
	},
}))(MuiAccordionDetails);

export default function ContractRequests(): JSX.Element {
	const { formatDate } = format
	const contract = React.useContext(ContractDetailContext).state.contract;
	const [expandedList, setExpandedList] = React.useState<number[]>([]);

	const handleChange = (requestId: number, expanded: boolean) => {
		if (expanded) {
			if (!expandedList.includes(requestId)) {
				setExpandedList([...expandedList, requestId]);
			}
		}
		else {
			setExpandedList(expandedList.filter(r => r !== requestId));
		}
	};

	React.useEffect(() => {
		setExpandedList(contract.requests.filter(r => r.isActive).map(r => r.id));
	}, [contract])

	return (
		<Frame title="Lịch sử phê duyệt" noPadding>
			{contract.requests.map((request, index) => (
				<Accordion
					square
					key={index}
					expanded={expandedList.includes(request.id)}
					onChange={(_event, expanded) => { handleChange(request.id, expanded) }}
				>
					<AccordionSummary style={{ backgroundColor: request.isReopen ? cyan[700] : green[600] }}>
						<Typography>
							{request.isReopen ?
								`Yêu cầu mở lại hợp đồng - ${formatDate(new Date(request.createdTime), 'hh:mm dd/MM/yyyy')}` :
								`Yêu cầu phê duyệt hợp đồng - ${formatDate(new Date(request.createdTime), 'hh:mm dd/MM/yyyy')}`}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container>
							<Grid item xs={12}>
								<div style={{ padding: '8px', borderLeft: '4px solid green' }} dangerouslySetInnerHTML={{ __html: request.content }}></div>
							</Grid>
							<Grid item xs={12}>
								<Table size="small" style={{ padding: '8px', borderLeft: '4px solid yellow' }}>
									<TableBody>
										{request.steps.map((step, stepIndex) => (
											<TableRow key={stepIndex}>
												<TableCell>
													<Grid container spacing={1}>
														<Grid item xs={12} md={4}>
															{`${step.userNumber}-${step.fullName}`}
														</Grid>
														<Grid item xs={12} md={2}>
															<FontAwesomeIcon style={{ opacity: 0.6 }} icon="share" />
															{step.isReceived && formatDate(new Date(step.receivedTime), 'hh:mm dd/MM/yyyy')}
														</Grid>
														<Grid item xs={12} md={2}>
															<FontAwesomeIcon style={{ opacity: 0.6 }} icon="eye" />
															{step.isSeen && formatDate(new Date(step.seenTime), 'hh:mm dd/MM/yyyy')}
														</Grid>
														<Grid item xs={12} md={2}>
															<FontAwesomeIcon style={{ opacity: 0.6 }} icon="signature" />
															{step.isApproved && formatDate(new Date(step.approvedTime), 'hh:mm dd/MM/yyyy')}
														</Grid>
														<Grid item xs={12} md={2}>
															<FontAwesomeIcon style={{ opacity: 0.6 }} icon="ban" />
															{step.isRejected && formatDate(new Date(step.rejectedTime), 'hh:mm dd/MM/yyyy')}
														</Grid>
														{step.content !== '' && step.content !== null && (
															<Grid item xs={12}>
																<div style={{ padding: '4px' }} dangerouslySetInnerHTML={{ __html: step.content }}></div>
															</Grid>
														)}
													</Grid>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Grid>
							{request.cancelReason !== '' && request.cancelReason !== null && (
								<Grid item xs={12}>
									<div style={{ padding: '8px', borderLeft: '4px solid red' }} dangerouslySetInnerHTML={{ __html: request.cancelReason }}></div>
								</Grid>
							)}
						</Grid>
					</AccordionDetails>
				</Accordion>
			))}
		</Frame>
	)
}