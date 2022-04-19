import React from 'react';
import {
	Grid,
} from '@material-ui/core';

import RoleManager from '../components/RoleManager';

export default function Designers(): JSX.Element {

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<RoleManager title="Khối lượng" role="DESIGNER_ROLE" />
			</Grid>
			<Grid item xs={12}>
				<RoleManager title="Phê duyệt dữ liệu" role="APPROVER_DESIGNER_ROLE" />
			</Grid>
		</Grid>
	)
}