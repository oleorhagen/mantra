import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { request, gql } from 'graphql-request';

import ResourceTable from '../../../../src/resource-table';
import Navigator from '../../../../src/breadcrumb-navigator';
// TODO - What to do with the results meta data (?)
import ResultsMetadata from '../../../../src/results-metadata';

const ResultsView = () => {
  const [results, setResults] = useState([]);
  const [metadata, setMetadata] = useState({});

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
      <ResourceTable resources={results} type="results" />
    </>
  );
};

export default ResultsView;
