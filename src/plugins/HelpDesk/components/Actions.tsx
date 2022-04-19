import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Grid,
} from '@material-ui/core';
import {
	Frame,
} from '@nvdunginest/emis-mui';

import { IssueDetailContext } from '../stores/IssueDetailStore';
import ActionDetail from './ActionDetail';
import CreateRequest from './CreateRequest';
import Attach from './Attach';

const useStyles = makeStyles((theme) => ({
	actions: {
		padding: theme.spacing(1),
	},
}));

export default function Actions(): JSX.Element {
	const classes = useStyles();
	const validActions = React.useContext(IssueDetailContext).state.validActions;

	return (
		<Frame title="Thao tác" noPadding>
			<Grid container spacing={1} className={classes.actions}>
				{validActions.filter(x => x !== 8 && x !== 11).map(action =>
					<ActionDetail
						key={action}
						activityCode={action}
					/>
				)}
				<CreateRequest />
				<Attach />
			</Grid>
		</Frame>
	)
}