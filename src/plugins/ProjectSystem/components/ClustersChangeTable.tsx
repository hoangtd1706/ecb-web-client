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
  ClusterViewModel,
} from '../services/cluster';

const getRowColor = (status: number): string => {
  switch (status) {
    case 1: return colors.green[500];
    case 2: return colors.amber[500];
    default: return colors.red[500];
  }
}

type Props = {
  data: TrackingChangeModel<ClusterViewModel>[];
}

export default function ClustersChangeTable({
  data,
}: Props): JSX.Element {
  return (
    <Table stickyHeader aria-label="sticky table" size="small">
      <TableHead>
        <TableRow>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Mã cấu kiện</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Diễn giải</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Ghi chú</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Chiết tính</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Số lượng</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Công tác</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index} style={{ backgroundColor: getRowColor(item.status) }}>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.code : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.code : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.description : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.description : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.note : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.note : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.filePath : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.filePath : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="right" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.elementCount : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.elementCount : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="right" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.itemCount : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.itemCount : '-'}
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
