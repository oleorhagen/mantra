import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  AnimatedBarStack,
  AnimatedBarSeries,
  XYChart,
  Tooltip
} from '@visx/xychart';

const data1 = [
  { x: '2020-01-01', y: 1 },
  { x: '2020-01-02', y: 0 },
  { x: '2020-01-03', y: 1 }
];

const data2 = [
  { x: '2020-01-01', y: 0 },
  { x: '2020-01-02', y: 1 },
  { x: '2020-01-03', y: 1 }
];

const accessors = {
  xAccessor: d => d.x,
  yAccessor: d => d.y
};

const PlotView = () => (
  <XYChart height={400} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
    <AnimatedAxis orientation="bottom" />
    <AnimatedGrid columns={false} numTicks={4} />
    <AnimatedBarStack>
      <AnimatedBarSeries dataKey="Line 1" data={data1} {...accessors} />
      <AnimatedBarSeries dataKey="Line 2" data={data2} {...accessors} />
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
);

export default PlotView;
