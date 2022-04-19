import React from 'react';
import {
	Grid,
} from '@material-ui/core';

import RoleManager from '../components/RoleManager';

export default function Forms(): JSX.Element {

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<RoleManager title="Biểu mẫu" role="FORM_ROLE" />
			</Grid>
		</Grid>
	)
}