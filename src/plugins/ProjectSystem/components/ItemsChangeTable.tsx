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
  ItemViewModel,
} from '../services/item';

import format from '../../../configs/format';

const getRowColor = (status: number): string => {
  switch (status) {
    case 1: return colors.green[500];
    case 2: return colors.amber[500];
    default: return colors.red[500];
  }
}

type Props = {
  data: TrackingChangeModel<ItemViewModel>[];
}

export default function ItemsChangeTable({
  data,
}: Props): JSX.Element {
  return (
    <Table stickyHeader aria-label="sticky table" size="small">
      <TableHead>
        <TableRow>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Mã cấu kiện</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Diễn giải cấu kiện</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Mã công tác</TableCell>
          <TableCell align="left" style={{ fontSize: '0.75rem' }}>Diễn giải công tác</TableCell>
          <TableCell align="center" style={{ fontSize: '0.75rem' }}>Đơn vị</TableCell>
          <TableCell align="right" style={{ fontSize: '0.75rem' }}>Khối lượng</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index} style={{ backgroundColor: getRowColor(item.status) }}>
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
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.serviceMasterCode : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.serviceMasterCode : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="left" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.serviceMasterDescription : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.serviceMasterDescription : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="center" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? item.post.serviceMasterUnit : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? item.pack.serviceMasterUnit : '-'}
                </Grid>
              </Grid>
            </TableCell>
            <TableCell align="right" style={{ fontSize: '0.75rem' }}>
              <Grid container direction="column">
                <Grid item>
                  {item.post !== null ? format.formatMoney(item.post.quantity, 3) : '-'}
                </Grid>
                <Grid item>
                  {item.pack !== null ? format.formatMoney(item.pack.quantity, 3) : '-'}
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
