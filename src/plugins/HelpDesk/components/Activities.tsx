import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Stepper,
	Step,
	StepLabel,
	StepContent,
} from '@material-ui/core';

import format from '../../../configs/format';

import { IssueDetailContext } from '../stores/IssueDetailStore';
import issueConstants from '../constants/issue';
import {
	Frame,
} from '@nvdunginest/emis-mui';

const useStyles = makeStyles((theme) => ({
	stepper: {
		padding: theme.spacing(1),
		[theme.breakpoints.down('xs')]: {
			fontSize: '12px',
		},
	},
}));

export default function Activities(): JSX.Element {
	const classes = useStyles();
	const activities = React.useContext(IssueDetailContext).state.activities;
	const { actions } = issueConstants;

	return (
		<Frame title="Lịch sử" noPadding>
			<Stepper orientation="vertical" className={classes.stepper}>
				{activities.map((activity, index) =>
					<Step key={index} active={true}>
						<StepLabel>
							{`${activity.createdByFullName} ${actions[activity.activityCode].text} lúc ${format.formatDate(new Date(activity.createdTime), 'hh:mm dd/MM/yyyy')}`}
						</StepLabel>
						{activity.content !== '' &&
							activity.content !== null &&
							activity.content !== undefined &&
							<StepContent>
								<div>
									<div dangerouslySetInnerHTML={{ __html: activity.content }}>
									</div>
								</div>
							</StepContent>
						}
					</Step>
				)}
			</Stepper>
		</Frame>
	)
}