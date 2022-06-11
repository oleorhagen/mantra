import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Typography } from '@mui/material';

import ResourceTable from '../../src/resource-table';

import { request, gql } from 'graphql-request';

const HistoryView = () => {
  const router = useRouter();
  const { count = 10, name } = router.query;

  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      const results = await getPipelines();
      setResults(results);
    })();
  }, [count, name]);

  const getPipelines = async () => {
    const query = gql`
      query TestHistoryForName {
        allResults(condition: { testName: "test_build.TestBuild.test_bootloader_embed" }, first: 10) {
          nodes {
            result
            resultMessage
            testName
            timestamp
            id
            jobId
          }
        }
      }
    `;

    // const today = new Date().toISOString().split('T')[0];
    const latestPipelines = await request({
      url: 'http://localhost/graphql',
      // variables: {
      //     date: today
      // },
      document: query,
      // requestHeaders: {
      //     Authorization: `Bearer ${process.env.GITLAB_TOKEN}`
      // }
    });
    console.log(`latestPipelines: ${latestPipelines}`);
    // TODO - figure out the difference between the nodes and the edges query...
    const {
      allResults: { nodes },
    } = latestPipelines;
    console.log(`edges: ${nodes}`);
    return nodes;
  };

  return (
    <>
      <Typography variant="h4">Test History</Typography>
      <Typography variant="h6">Test Case {name}</Typography>
      <ResourceTable resources={results} type="results" />
    </>
  );
};

export default HistoryView;
