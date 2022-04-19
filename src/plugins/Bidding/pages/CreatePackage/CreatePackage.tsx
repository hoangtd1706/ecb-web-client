import React from 'react';
import {
  Grid,
} from '@material-ui/core';

import CreatePackageProvider, { CreatePackageContext } from '../../stores/CreatePackageStore';

import Header from './Header';
import Items from './Items';

function CreatePackage(): JSX.Element {
  const { getInputData } = React.useContext(CreatePackageContext);

  React.useEffect(() => {
    getInputData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <Grid item xs={12}>
        <Items />
      </Grid>
    </Grid>
  )
}

export default function CreatePackageConsumer(): JSX.Element {
  return (
    <CreatePackageProvider>
      <CreatePackage />
    </CreatePackageProvider>
  )
}