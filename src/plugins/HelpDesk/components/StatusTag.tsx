import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { red, teal, blue, green, amber } from '@material-ui/core/colors';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Tooltip,
} from '@material-ui/core';
import { PaletteType } from '@nvdunginest/emis-mui';

const useStyles = makeStyles(() => ({
	secondary: {
		color: red[500],
	},
	success: {
		color: green[500],
	},
	info: {
		color: teal[500],
	},
	warning: {
		color: amber[500],
	},
	danger: {
		color: red[500],
	},
	primary: {
		color: blue[500],
	},
	dark: {
		color: blue[500],
	},
	inherit: {
		color: 'inherit',
	},
}));

type StatusTagProps = {
	text: string;
	icon: IconName;
	color: PaletteType;
}

export default function StatusTag({
	text,
	icon,
	color,
}: StatusTagProps): JSX.Element {
	const classes = useStyles();
	return (
		<Tooltip title={text}>
			<div>
				<FontAwesomeIcon icon={icon} className={classes[color]} style={{ fontSize: '1.25rem' }} />
			</div>
		</Tooltip>
	)
}