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
    console.log('jobs/index.js useEffect...');
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

    // const today = new Date().toISOString().split('T')[0];
    const pipelineJobs = await request({
      url: 'http://localhost/graphql',
      // variables: {
      //     date: today
      // },
      document: query,
      // requestHeaders: {
      //     Authorization: `Bearer ${process.env.GITLAB_TOKEN}`
      // }
    });
    console.log(`getPipelines: pipelineJobs: ${pipelineJobs}`);
    // TODO - figure out the difference between the nodes and the edges query...
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
