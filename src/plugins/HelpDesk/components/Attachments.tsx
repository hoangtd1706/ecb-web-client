import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Grid,
	Typography,
} from '@material-ui/core';
import {
	Frame,
	DownloadButton,
} from '@nvdunginest/emis-mui';

import format from '../../../configs/format';

import { IssueDetailContext } from '../stores/IssueDetailStore';

const useStyles = makeStyles((theme) => ({
	actions: {
		padding: theme.spacing(1),
	},
}));

export default function Attachments(): JSX.Element {
	const classes = useStyles();
	const issue = React.useContext(IssueDetailContext).state.issue;
	const attachments = React.useContext(IssueDetailContext).state.issue.attachments;

	return (
		<Frame title="Tài liệu đính kèm" noPadding>
			<Grid container spacing={1} className={classes.actions} direction="row">
				{attachments.map(attachment => (
					<Grid item xs={12} md={4} key={attachment.fileName} container direction="column">
						<Grid item>
							<DownloadButton
								filename={attachment.fileName}
								label={attachment.fileName}
								url={`/api/help-desk/issues/downloadAttachment/${issue.id}?fileName=${attachment.fileName}`}
							/>
						</Grid>
						<Grid item>
							<Typography variant="caption">
								{`${attachment.createdBy}-${attachment.createdByFullName} tạo lúc ${format.formatDate(new Date(attachment.createdTime), 'dd/MM/yyyy')}`}
							</Typography>
						</Grid>
					</Grid>
				))}
			</Grid>
		</Frame>
	)
}