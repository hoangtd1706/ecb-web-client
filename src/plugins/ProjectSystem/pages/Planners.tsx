import React from 'react';
import {
	Grid,
} from '@material-ui/core';

import RoleManager from '../components/RoleManager';

export default function Planners(): JSX.Element {

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<RoleManager title="Kế hoạch" role="PLANNER_ROLE" />
			</Grid>
			<Grid item xs={12}>
				<RoleManager title="Phê duyệt dữ liệu" role="APPROVER_PLANNER_ROLE" />
			</Grid>
		</Grid>
	)
}
