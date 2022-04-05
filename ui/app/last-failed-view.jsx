import React, { useEffect, useState } from 'react';

import ResourceTable from './resource-table';

const LastFailedView = ({ build_name, count, match, project_id }) => {
  /**
   * This will populate all failed tests and how many times each failed
   * in the last <count> executions for a specific build.
   */
  const [results, setResults] = useState([]);

  const buildName = () => encodeURIComponent(match.params.build_name || build_name);

  useEffect(() => {
    const url = `/api/projects/${match.params.project_id || project_id}/status/failed/count/${match.params.count || count}?build_name=${buildName()}`;
    const lastFailedResultsRequest = fetch(url)
      .then((response) => response.json())
      .then((result) => setResults(result));
    return () => {
      lastFailedResultsRequest.abort();
    };
  }, []);

  return (
    <div>
      <h2 className="rs-page-title">Last Failed</h2>
      <h3>Failed results</h3>
      <ResourceTable resources={results} type="results" />
    </div>
  );
};

export default LastFailedView;
