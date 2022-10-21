import React from 'react';

import { Paper } from '@mui/material';

import SpuriousFailuresView from '../src/statistics/spurious-failures-view';
import PlotView from '../src/statistics/plot-view';

const Stats = props => {
  return (
    <Paper elevation={0}>
      <SpuriousFailuresView />
      <PlotView />
    </Paper>
  );
};

export default Stats;
