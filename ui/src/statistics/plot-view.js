import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';

import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  AnimatedBarStack,
  AnimatedBarSeries,
  XYChart,
  Tooltip
} from '@visx/xychart';

const accessors = {
  xAccessor: d => {
    if (d.failures) {
      return d.failures.map(e => {
        console.log('converting: ' + e);
        console.log('to: ' + dayjs.unix(e).format('DD/MM/YYYY'));
        return dayjs.unix(e).format('DD/MM/YYYY');
      });
    }
    return 'None';
  },
  yAccessor: d => 1
};

const PlotView = props => {
  const [results, setResults] = useState([]);

  const fetchStatistics = params => {
    fetch('/api/tests/statistics/spurious-failures/viz' + '?' + new URLSearchParams(params))
      .then(response => response.json())
      .then(result => {
        console.log('the returned result:');
        console.log(result);
        // Transform the result into the local x,y schema
        setResults(result);
      })
      .catch(err => console.log('Failed to fetch the test statistics: ' + err));
    // .finally(() => setLoading(false));
  };

  useEffect(() => {
    // setLoading(true);
    console.log('plot-view use-effect:');
    console.log(props.sinceDate);
    fetchStatistics({ since_time: props.sinceDate.unix() });
  }, [props.sinceDate]);

  let foobar = results ? results.map((e, i) => <AnimatedBarSeries dataKey={e.test_name} data={[e]} {...accessors} />) : [];

  let now = dayjs();
  let baselineDays = [];
  let tempDate = props.sinceDate;
  while (tempDate.isBefore(now) || tempDate.isSame(now)) {
    // TODO - Unify the format somehow (?)
    baselineDays.push({ 'date': tempDate.format('DD/MM/YYYY') });
    tempDate = tempDate.add(1, 'day');
  }

  console.log('baselineDays:');
  console.log(baselineDays);

  return (
    <>
      {'foobar' + foobar.length}
      <XYChart height={400} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
        <AnimatedAxis orientation="bottom" />
        <AnimatedGrid columns={false} numTicks={4} />
        <AnimatedBarStack>
          <AnimatedBarSeries dataKey="baseline" data={baselineDays} xAccessor={d => d.date} yAccessor={d => 0} />
          {foobar}
        </AnimatedBarStack>
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showVerticalCrosshair
          showSeriesGlyphs
          renderTooltip={({ tooltipData, colorScale }) => (
            <div>
              <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>{tooltipData.nearestDatum.key}</div>
              {accessors.xAccessor(tooltipData.nearestDatum.datum)}
              {', '}
              {accessors.yAccessor(tooltipData.nearestDatum.datum)}
            </div>
          )}
        />
      </XYChart>
    </>
  );
};

export default PlotView;
