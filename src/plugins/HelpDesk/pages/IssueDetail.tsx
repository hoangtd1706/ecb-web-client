import React from 'react';
import { useParams } from 'react-router-dom';
import {
	Grid,
} from '@material-ui/core';

import IssueDetailProvider, { IssueDetailContext } from '../stores/IssueDetailStore';

import IssueHeader from '../components/IssueHeader';
import Activities from '../components/Activities';
import Actions from '../components/Actions';
import Attachments from '../components/Attachments';

function IssueDetail(): JSX.Element {
	const { issueId }: never = useParams();
	const { getIssueDetail } = React.useContext(IssueDetailContext);

	React.useEffect(() => {
		getIssueDetail(issueId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [issueId])

	return (
		<Grid container alignContent="stretch" spacing={2}>
			<Grid item xs={12}>
				<IssueHeader />
			</Grid>
			<Grid item xs={12}>
				<Activities />
			</Grid>
			<Grid item xs={12}>
				<Actions />
			</Grid>
			<Grid item xs={12}>
				<Attachments />
			</Grid>
		</Grid>
	)
}

export default function IssueDetailConsumer(): JSX.Element {
	return (
		<IssueDetailProvider>
			<IssueDetail />
		</IssueDetailProvider>
	)
}