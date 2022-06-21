import { Breadcrumbs, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import Link from '../components/link';

const Navigator = () => {
  const router = useRouter();
  const { pipelineid, jobid } = router.query;

  const path = router.asPath.split('/').pop();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/pipelines">
        Pipelines
      </Link>
      {jobid && (
        <Link underline="hover" color="inherit" href={`/pipelines/${pipelineid}/jobs`}>
          Jobs
        </Link>
      )}
      <Typography color="inherit">{path}</Typography>
    </Breadcrumbs>
  );
};

export default Navigator;
