import React from 'react';
import { useDispatch } from 'react-redux';
import {
	Grid,
} from '@material-ui/core';
import {
	Frame,
} from '@nvdunginest/emis-mui';

import {
	AppDispatch,
	alertActions,
} from '../../../core';

import ServiceMastersComboBox from '../components/ServiceMastersComboBox';
import MaterialsComboBox from '../components/MaterialsComboBox';

import {
	ServiceMasterModel,
} from '../services/serviceMaster';

import {
	MaterialModel,
} from '../services/material';

export default function Items(): JSX.Element {
	const dispatch: AppDispatch = useDispatch();

	const [serviceMaster, setServiceMaster] = React.useState<ServiceMasterModel | null>(null);
	const [material, setMaterial] = React.useState<MaterialModel | null>(null);

	const copyToClipboard = (value: string) => {
		const el = document.createElement('textarea');
		el.value = value;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Frame title="Tra cứu mã công tác">
					<ServiceMastersComboBox
						value={serviceMaster}
						onChange={(value) => {
							setServiceMaster(value);
							copyToClipboard(value.code);
							dispatch(alertActions.show('Mã công tác đã được copy vào clipboard', 'success'));
						}}
					/>
				</Frame>
			</Grid>
			<Grid item xs={12}>
				<Frame title="Tra cứu mã vật tư">
					<MaterialsComboBox
						value={material}
						onChange={(value) => {
							setMaterial(value);
							copyToClipboard(value.code);
							dispatch(alertActions.show('Mã vật tư đã được copy vào clipboard', 'success'));
						}}
					/>
				</Frame>
			</Grid>
		</Grid>
	);
}
