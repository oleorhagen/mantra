import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Button, Stack, Typography } from '@mui/material';
import { ArrowBackIosNew as ArrowBackIcon, ArrowForwardIos as ArrowForwardIcon } from '@mui/icons-material';

import { request, gql } from 'graphql-request';

import ResourceTable from '../../../../src/resource-table';
import Navigator from '../../../../src/breadcrumb-navigator';
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

    const latestPipelines = await request({
      url: 'http://localhost/graphql',
      // variables: {
      //     date: today
      // },
      document: query,
    });
    console.log(`jobid: latestPipelines: ${latestPipelines}`);
    const {
      jobById: {
        resultsByJobId: { nodes },
      },
    } = latestPipelines;
    console.log(`nodes: ${nodes}`);
    return nodes;
  };

  useEffect(() => {
    (async () => {
      const result = await getResultsForJob(jobid);
      setResults(result);
    })();
  }, [jobid]);

  return (
    <>
      <Navigator />
      <Typography variant="h6">Summary</Typography>
      <ResourceTable resources={results} type="results" />
    </>
  );
};

export default ResultsView;
