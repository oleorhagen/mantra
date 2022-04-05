import React, { useEffect, useState } from 'react';

import ResourceTable from './resource-table';

const HistoryView = ({ count, match, project_id, test_name }) => {
  const [results, setResults] = useState([]);

  const testName = () => encodeURIComponent(match.params.test_name || test_name);

  useEffect(() => {
    const url = `/api/projects/${match.params.project_id || project_id}/test_name/${testName()}/count/${match.params.count || count}`;
    const historyResultsRequest = fetch(url)
      .then((response) => response.json())
      .then((result) => setResults(result));
    return () => {
      historyResultsRequest.abort();
    };
  }, []);

  return (
    <div>
      <h2 className="rs-page-title">Test History</h2>
      <h3>Test Case {testName()}</h3>
      <ResourceTable resources={results} type="results" />
    </div>
  );
};

export default HistoryView;
