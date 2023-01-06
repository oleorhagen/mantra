import React, { useState } from 'react';

import { Paper } from '@mui/material';

import dayjs from 'dayjs';

import SpuriousFailuresView from '../src/statistics/spurious-failures-view';
import PlotView from '../src/statistics/plot-view';
import TestPlot from '../src/statistics/test-plot';

// TODO - Handle the search filter here

const Stats = props => {
  const [sinceDate, setSinceDate] = useState(dayjs().subtract(7, 'day'));

  return (
    <Paper elevation={0}>
      <SpuriousFailuresView sinceDate={sinceDate} setSinceDate={setSinceDate} />
      <PlotView sinceDate={sinceDate} />
      <TestPlot />
    </Paper>
  );
};

export default Stats;
