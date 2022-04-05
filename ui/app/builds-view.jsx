import React, { useEffect, useState } from 'react';

import ResourceTable from './resource-table';

const BuildsView = ({ match, project_id }) => {
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    var url = `/api/projects/${match.params.project_id || project_id}/builds`;
    const buildsRequest = fetch(url)
      .then((response) => response.json())
      .then((result) => setBuilds(result));
    return () => {
      buildsRequest.abort();
    };
  }, []);

  return (
    <div>
      <h2 className="rs-page-title">Builds</h2>
      <ResourceTable builds={builds} type="builds" />
    </div>
  );
};

export default BuildsView;
