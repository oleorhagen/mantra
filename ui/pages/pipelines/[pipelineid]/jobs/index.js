import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { request, gql } from 'graphql-request';

import { Typography } from '@mui/material';

import ResourceTable from '../../../../src/resource-table';

const BuildsView = () => {
  const router = useRouter();
  const { pipelineid } = router.query;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!pipelineid) {
      return;
    }
    (async () => {
      const pipelines = await getPipelines(pipelineid);
      setJobs(pipelines);
    })();
  }, [pipelineid]);

  const getPipelines = async pipelineid => {
    const query = gql`
query GetJobsForPipeline {
  pipelineById(id: ${pipelineid}) {
    jobsByPipelineId {
      nodes {
        id
        buildUrl
        name
        status
        tags
      }
    }
  }
}                    `;

    const pipelineJobs = await request({
      url: 'http://localhost/graphql',
      // variables: {
      //     date: today
      // },
      document: query,
    });
    console.log(`getPipelines: pipelineJobs: ${pipelineJobs}`);
    const {
      pipelineById: {
        jobsByPipelineId: { nodes },
      },
    } = pipelineJobs;
    console.log(`getPipelines: nodes: ${nodes}`);
    return nodes;
  };

  return (
    <>
      <Typography variant="h4">Jobs</Typography>
      <ResourceTable resources={jobs} type="jobs" />
    </>
  );
};

export default BuildsView;
