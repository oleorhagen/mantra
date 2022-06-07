import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Typography } from '@mui/material';

import ResourceTable from '../../../../src/resource-table';

const BuildsView = () => {
  const router = useRouter();
  const { projectid } = router.query;
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    if (!projectid) {
      return;
    }
    fetch(`/api/projects/${projectid}/builds`)
      .then(response => response.json())
      .then(result => setBuilds(result));
  }, [projectid]);

  return (
    <>
      <Typography variant="h4">Builds</Typography>
      <ResourceTable resources={builds} type="builds" />
    </>
  );
};

export default BuildsView;
