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

    // const today = new Date().toISOString().split('T')[0];
    const failingTests = await request({
      url: 'http://localhost/graphql',
      // variables: {
      //     date: today
      // },
      document: query,
      // requestHeaders: {
      //     Authorization: `Bearer ${process.env.GITLAB_TOKEN}`
      // }
    });
    console.log(`failingTests: ${failingTests}`);
    // TODO - figure out the difference between the nodes and the edges query...
    const {
      allResults: { nodes },
    } = failingTests;
    console.log(`edges: ${nodes}`);
    return nodes;
  };

  return (
    <>
      <Typography marginBottom={2} variant="h4">
        Pipelines{' '}
      </Typography>{' '}
      <ResourceTable resources={results} type="results" />
    </>
  );
};

export default StatisticsView;
