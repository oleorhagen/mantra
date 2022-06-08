import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Button, Stack, Typography } from '@mui/material';
import { ArrowBackIosNew as ArrowBackIcon, ArrowForwardIos as ArrowForwardIcon } from '@mui/icons-material';

import { request, gql } from 'graphql-request';

import ResourceTable from '../../../../src/resource-table';
import ResultsMetadata from '../../../../src/results-metadata';

const OFFSET_DELTA = 25;

const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [offset, setOffset] = useState(0);

  const router = useRouter();
  const { jobid, pipelineid } = router.query;

  const getResultsForJob = async jobID => {
    if (!jobID) {
      return {};
    }
    const query = gql`
      query ResultsForJob {
        jobById(id: ${jobID}) {
          resultsByJobId {
            nodes {
              id
              jobId
              result
              resultMessage
              tags
              testName
              timestamp
            }
            pageInfo {
              startCursor
              endCursor
            }
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
    console.log(`jobid: latestPipelines: ${latestPipelines}`);
    // TODO - figure out the difference between the nodes and the edges query...
    const {
      jobById: {
        resultsByJobId: { nodes },
      },
    } = latestPipelines;
    console.log(`edges: ${nodes}`);
    return nodes;
  };

  // const getResults = useCallback(
  //   offset =>
  //     // TODO - Replace with GraphQL
  //     fetch(`/api/projects/${pipelineid}/builds/${jobid}/results?offset=${offset}`)
  //       .then(response => response.json())
  //       .then(result => {
  //         setResults(result.results);
  //         setMetadata(result.metadata);
  //         setOffset(offset);
  //       }),
  //   [pipelineid, jobid]
  // );

  useEffect(() => {
    (async () => {
      const result = await getResultsForJob(jobid);
      setResults(result);
    })();
  }, [jobid]);

  return (
    <>
      <Typography variant="h4">Results</Typography>
      <Typography variant="h6">Summary</Typography>
      <ResourceTable resources={results} type="results" />
    </>
  );
};

export default ResultsView;
