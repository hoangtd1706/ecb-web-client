import React from 'react';
import { green, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import {
	Typography,
	Accordion as MuiAccordion,
	AccordionSummary as MuiAccordionSummary,
	AccordionDetails as MuiAccordionDetails,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
	Frame,
} from '@nvdunginest/emis-mui';

import { VendorModel, ItemModel } from '../../services/package';
import Quotation from './Quotation';

const Accordion = withStyles({
	root: {
		border: '1px solid rgba(0, 0, 0, .125)',
		boxShadow: 'none',
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			margin: 'auto',
		},
	},
	expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
	root: {
		color: '#fff',
		fontStyle: 'uppercase',
		borderBottom: '1px solid rgba(0, 0, 0, .125)',
		marginBottom: -1,
		minHeight: 40,
		'&$expanded': {
			minHeight: 40,
		},
	},
	content: {
		margin: 0,
		'& .MuiTypography-body1': {
			fontSize: '0.9rem',
		},
		'&$expanded': {
			margin: '0',
		},
	},
	expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(() => ({
	root: {
		padding: 0,
	},
}))(MuiAccordionDetails);

type Props = {
	packageCode: string;
	canViewData: boolean;
	isClosedPackage: boolean;
	vendors: VendorModel[];
	packageItems: ItemModel[];
}

export default function Vendors({
	packageCode,
	canViewData,
	isClosedPackage,
	vendors,
	packageItems,
}: Props): JSX.Element {
	const [expandedList, setExpandedList] = React.useState<string[]>([]);

	const handleChange = (vendorCode: string, expanded: boolean) => {
		if (expanded) {
			if (!expandedList.includes(vendorCode)) {
				setExpandedList([...expandedList, vendorCode]);
			}
		}
		else {
			setExpandedList(expandedList.filter(r => r !== vendorCode));
		}
	};

	return (
		<Frame title="Danh sách nhà cung cấp" noPadding>
			{vendors.map((vendor) => (
				<Accordion
					square
					key={vendor.code}
					expanded={expandedList.includes(vendor.code)}
					onChange={(_event, expanded) => { handleChange(vendor.code, expanded) }}
					disabled={!(isClosedPackage && vendor.submitted && canViewData)}
				>
					<AccordionSummary style={{ backgroundColor: vendor.submitted ? green[700] : red[700] }}>
						<Typography>
							{`${vendor.code} - ${vendor.longTextName} `}
							<FontAwesomeIcon icon={vendor.submitted ? 'check-circle' : 'times-circle'} />
							{` ${vendor.submitted ? 'Đã nộp chào giá' : 'Chưa nộp chào giá'}`}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{expandedList.includes(vendor.code) && (
							<Quotation
								packageCode={packageCode}
								packageItems={packageItems}
								vendorCode={vendor.code}
							/>
						)}
					</AccordionDetails>
				</Accordion>
			))}
		</Frame>
	)
}