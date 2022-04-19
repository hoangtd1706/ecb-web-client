import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
	green,
	grey,
	red,
	teal,
	amber,
	blue,
} from '@material-ui/core/colors';
import { PaletteType } from '@nvdunginest/emis-mui';

const useStyles = makeStyles((theme) => ({
	badge: {
		marginRight: theme.spacing(0.5),
		padding: theme.spacing(0.2),
		paddingLeft: theme.spacing(0.5),
		paddingRight: theme.spacing(0.5),
		borderRadius: '4px',
		fontWeight: 'bold',
		fontSize: theme.spacing(1.4),
	},
	secondary: {
		color: 'white',
		backgroundColor: grey[500],
	},
	success: {
		color: 'white',
		backgroundColor: green[500],
	},
	info: {
		color: 'white',
		backgroundColor: teal[500],
	},
	warning: {
		color: 'black',
		backgroundColor: amber[500],
	},
	danger: {
		color: 'white',
		backgroundColor: red[500],
	},
	primary: {
		color: 'white',
		backgroundColor: blue[500],
	},
	dark: {
		color: 'white',
		backgroundColor: 'black',
	},
	inherit: {
		color: 'inherit',
		backgroundColor: 'inherit',
	},
}));

type TagProps = {
	text: string;
	variant: PaletteType;
}

export default function Tag({ text, variant }: TagProps): JSX.Element {
	const classes = useStyles();
	return (
		<span className={clsx(classes.badge, classes[variant])}>{text}</span>
	)
}