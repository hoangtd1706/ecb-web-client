import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography,
	Card,
	CardHeader,
	CardContent,
	Divider,
	Hidden,
} from '@material-ui/core';

import issueConstants from '../constants/issue';
import { IssueDetailContext } from '../stores/IssueDetailStore';
import Tag from '../components/Tag';
import StatusTag from '../components/StatusTag';

const useStyles = makeStyles((theme) => ({
	cardContent: {
		padding: theme.spacing(2),
		[theme.breakpoints.down('xs')]: {
			fontSize: '12px',
			padding: theme.spacing(1),
		},
	},
	cardHeader: {
		padding: theme.spacing(1),
		paddingLeft: theme.spacing(2),
		[theme.breakpoints.down('xs')]: {
			paddingLeft: theme.spacing(1),
		},
	},
	title: {
		fontWeight: 'bold',
		alignItems: 'center',
		[theme.breakpoints.down('xs')]: {
			fontSize: '14px',
		},
	},
	cell: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
	},
	status: {
		marginRight: theme.spacing(1),
		alignItems: 'center',
		verticalAlign: 'middle',
		display: 'flex',
	},
}));

export default function IssueHeader(): JSX.Element {
	const classes = useStyles();
	const { status, severity, priority } = issueConstants;
	const issue = React.useContext(IssueDetailContext).state.issue;

	return (
		<Card>
			<CardHeader
				title={
					<div className={classes.cell}>
						<div className={classes.status}>
							<StatusTag
								text={status[issue.status].text}
								icon={status[issue.status].icon}
								color={status[issue.status].color}
							/>
						</div>
						<div style={{ flexGrow: 1 }}>
							<Typography variant="h6" className={classes.title}>
								{`[#${issue.id}] ${issue.title}`}
							</Typography>
							<Hidden xsDown>
								<Typography>
									<Tag text={severity[issue.severity].text} variant={severity[issue.severity].variant} />
									<Tag text={priority[issue.priority].text} variant={priority[issue.priority].variant} />
									<Tag text={issue.moduleName} variant="primary" />
								</Typography>
							</Hidden>
						</div>
					</div>
				}
				className={classes.cardHeader}
			/>
			<Divider />
			<CardContent className={classes.cardContent}>
				<div dangerouslySetInnerHTML={{ __html: issue.content }} ></div>
			</CardContent>
		</Card>
	)
}