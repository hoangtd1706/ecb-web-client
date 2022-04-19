import React from 'react';
import { useParams } from 'react-router-dom';
import {
	Grid,
} from '@material-ui/core';

import ContractDetailProvider, { ContractDetailContext } from '../../stores/ContractDetailStore';

import Header from './ContractHeader';
import Items from './ContractItems';
import Requests from './ContractRequests';
import Attachments from './ContractAttachments';

function ContractDetail(): JSX.Element {
	const { contractNumber }: never = useParams();
	const { getContractDetail } = React.useContext(ContractDetailContext);

	React.useEffect(() => {
		getContractDetail(contractNumber)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contractNumber]);

	return (
		<Grid id="section-to-print" container alignContent="stretch" spacing={2}>
			<Grid item xs={12}>
				<Header />
			</Grid>
			<Grid item xs={12}>
				<Items />
			</Grid>
			<Grid item xs={12}>
				<Requests />
			</Grid>
			<Grid item xs={12}>
				<Attachments />
			</Grid>
		</Grid>
	)
}

export default function ContractDetailConsumer(): JSX.Element {
	return (
		<ContractDetailProvider>
			<ContractDetail />
		</ContractDetailProvider>
	)
}