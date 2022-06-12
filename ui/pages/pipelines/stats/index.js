import { Typography } from '@mui/material';

import { request, gql } from 'graphql-request';

import React, { useEffect, useState } from 'react';

import ResourceTable from '../../../src/resource-table';

const StatisticsView = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      const results = await getResults();
      setResults(results);
    })();
  }, []);

  // TODO - should probably use a custom PostGraphile function here:
  // https://www.graphile.org/postgraphile/custom-queries/
  const getResults = async () => {
    const query = gql`
      query StatsWeek {
        allResults(orderBy: TIMESTAMP_ASC, condition: { result: "failed" }) {
          nodes {
            id
            jobId
            result
            resultMessage
            tags
            testName
            timestamp
          }
        }
      }
    `;

    const failingTests = await request({
      url: 'http://localhost/graphql',
      // variables: {
      //     date: today
      // },
      document: query,
    });
    console.log(`failingTests: ${failingTests}`);
    const {
      allResults: { nodes },
    } = failingTests;
    console.log(`nodes: ${nodes}`);
    return nodes;
  };

  return (
    <>
      <Typography marginBottom={2} variant="h4">
        Statistics{' '}
      </Typography>{' '}
      {/* <ResourceTable resources={results} type="results" /> */}
    </>
  );
};

export default StatisticsView;
