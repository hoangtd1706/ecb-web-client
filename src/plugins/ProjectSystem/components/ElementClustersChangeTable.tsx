import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  colors,
} from '@material-ui/core';

import {
  TrackingChangeModel,
} from '../services/common';

import {
  ElementClusterViewModel,
} from '../services/elementCluster';

const getRowColor = (status: number): string => {
  switch (status) {
    case 1: return colors.green[500];
    case 2: return colors.amber[500];
    default: return colors.red[500];
  }
}

type Props = {
  data: TrackingChangeModel<ElementClusterViewModel>[];
}

export default function ElementClustersChangeTable({
  data,
}: Props): JSX.Element {
  return (
    <Table stickyHeader aria-label="sticky table" size="small">
      <TableHead>
        <TableRow>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Mã WBS</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Diễn giải WBS</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Mã cấu kiện</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Diễn giải cấu kiện</TableCell>
          <TableCell align="right" style={{ fontSize: '0.75rem' }}>Số lượng</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index} style={{ backgroundColor: getRowColor(item.status) }}>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.elementCode : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.elementCode : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.elementDescription : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.elementDescription : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.clusterCode : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.clusterCode : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.clusterDescription : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.clusterDescription : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="right" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.quantity : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.quantity : '-'}
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
