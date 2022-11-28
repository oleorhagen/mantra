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

import { LegendOrdinal } from '@visx/legend';
// import { scaleThreshold } from '@visx/scale';
// const colorScale = scaleOrdinal({
//     range: ["#ff8906", "#3da9fc", "#ef4565", "#7f5af0", "#2cb67d"],
//     domain: [...new Set(data.map(color))],
// })

// const threshold = scaleThreshold({
//   domain: [0.02, 0.04, 0.06, 0.08, 0.1],
//   range: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f']
// });

const accessors = {
  xAccessor: d => {
    return d.date;
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

  const transformData = params => {
    // Transform from the data format of the server to the one we present
    // [T1, T1, ...] => [ {'x': date(T1)}, {'x': date(T2)}]
    console.log('transformData received params:');
    console.log(params);
    return params
      .map(failureDate => {
        console.log('in map:');
        console.log(failureDate);
        return { 'date': dayjs.unix(failureDate).format('DD-MM-YYYY') };
      })
      .sort();
  };

  let testFailuresBarSeries = results
    ? results.map((e, i) => <AnimatedBarSeries key={i} dataKey={e.test_name} data={transformData(e.failures)} {...accessors} />)
    : [];

  let now = dayjs();
  let baselineDays = [];
  let tempDate = props.sinceDate;
  while (tempDate.isBefore(now) || tempDate.isSame(now)) {
    // TODO - Unify the format somehow (?)
    baselineDays.push({ 'date': tempDate.format('YYYY-MM-DD') });
    tempDate = tempDate.add(1, 'day');
  }

  console.log('baselineDays:');
  console.log(baselineDays);

  console.log('testFailureBarSeries:');
  console.log(testFailuresBarSeries);

  return (
    <div>
      <>
        {'testFailuresBarSeries' + testFailuresBarSeries.length}
        <XYChart height={400} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
          <AnimatedAxis orientation="bottom" />
          <AnimatedGrid columns={false} numTicks={1} />
          <AnimatedBarStack>
            {/* <AnimatedBarSeries dataKey="baseline" data={baselineDays} xAccessor={d => d.date} yAccessor={d => 0} /> */}
            {testFailuresBarSeries}
          </AnimatedBarStack>
          <Tooltip
            renderTooltip={({ tooltipData, colorScale }) => {
              console.log('ToolTip: ');
              console.log(tooltipData);
              return (
                <div>
                  <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>{tooltipData.nearestDatum.key}</div>
                  {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                  {', '}
                  {accessors.yAccessor(tooltipData.nearestDatum.datum)}
                </div>
              );
            }}
          />
        </XYChart>
      </>
    </div>
  );
};

export default PlotView;
