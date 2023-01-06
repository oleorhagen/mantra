import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';

import {
  Axis,
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  AnimatedBarStack,
  AnimatedBarSeries,
  XYChart,
  Tooltip
} from '@visx/xychart';

const generateDataArrayFromFailureDates = (baseDate, failureDates) => {
  let data = [];

  if (failureDates.length == 0) {
    return data;
  }

  let now = dayjs();
  let tempDate = baseDate;
  var failureDateIndex = 0;
  while (tempDate.isBefore(now) || tempDate.isSame(now)) {
    // TODO - Unify the format somehow (?)
    var failureDate = failureDates[failureDateIndex] || '01/01/1970';
    if (tempDate.format('DD/MM/YYYY') == dayjs.unix(failureDate).format('DD/MM/YYYY')) {
      // Increment the index
      failureDateIndex++;
      data.push({ 'date': tempDate.format('DD/MM/YYYY'), 'y': 1 });
    } else {
      data.push({ 'date': tempDate.format('DD/MM/YYYY'), 'y': 0 });
    }
    tempDate = tempDate.add(1, 'day');
  }
  return data;
};

const accessors = {
  xAccessor: d => {
    return d.date;
  },
  yAccessor: d => 1
};

const PlotView = props => {
  const [results, setResults] = useState([]);

  let now = dayjs();
  let baselineDays = [];
  let tempDate = props.sinceDate;
  while (tempDate.isBefore(now) || tempDate.isSame(now)) {
    // TODO - Unify the format somehow (?)
    baselineDays.push(tempDate.format('DD/MM/YYYY'));
    tempDate = tempDate.add(1, 'day');
  }

  console.log('baselineDays:');
  console.log(baselineDays);

  const fetchStatistics = params => {
    fetch('/api/tests/statistics/spurious-failures/viz' + '?' + new URLSearchParams(params))
      .then(response => response.json())
      .then(result => {
        console.log('the returned result:');
        console.log(result);

        var data = [];
        for (var r of result) {
          console.log('r result');
          console.log(r);
          data.push({ 'test_name': r.test_name, 'data': generateDataArrayFromFailureDates(props.sinceDate, r.failures) });
        }
        // Transform the result into the local x,y schema
        console.log('final generated data:');
        console.log(data);
        setResults(data);
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

  return (
    <div>
      <>
        <XYChart height={400} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
          <AnimatedAxis orientation="bottom" />
          <AnimatedGrid columns={false} numTicks={2} />
          <AnimatedBarStack>
            {results.map(e => (
              <AnimatedBarSeries dataKey={e.test_name} data={e.data} xAccessor={d => d.date} yAccessor={d => d.y} />
            ))}
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
