import React from 'react';

import { Paper } from '@mui/material';

import SpuriousFailuresView from '../src/statistics/spurious-failures-view.js';

const Stats = props => {
  return (
    <Paper elevation={0}>
      <SpuriousFailuresView />
    </Paper>
  );
};

export default Stats;
