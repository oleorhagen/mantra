import React, { useEffect, useState } from 'react';

import ResultsMetadata from './results-metadata';
import ResourceTable from './resource-table';

const buttonStyle = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'rgb(221, 221, 221)',
  borderRadius: '7px',
  paddingBottom: '5px',
  paddingTop: '5px',
  paddingLeft: '14px',
  paddingRight: '14px',
  fontSize: '14px',
  boxSizing: 'border-box',
  textDecoration: 'none'
};

const rowStyle = {
  marginBottom: '12px'
};

const ResultsView = ({ build_id, match, project_id }) => {
  const [results, setResults] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [offset, setOffset] = useState(0);
  const [getResultsRequest, setGetResultsRequest] = useState();

  useEffect(() => {
    const request = getResults(offset);
    setGetResultsRequest(request);
    return () => {
      getResultsRequest.abort();
    };
  }, []);

  const getResults = (offset) => {
    const request = fetch(`/api/projects/${match.params.project_id || project_id}/builds/${match.params.build_id || build_id}/results?offset=${offset}`)
      .then((response) => response.json())
      .then((result) => {
        setResults(result.results);
        setMetadata(result.metadata);
        setOffset(offset);
      });
    setGetResultsRequest(request);
  };

  const offsetIncrease = () => {
    if (offset + 25 < metadata['total_results']) {
      getResults(offset + 25);
    }
    console.log(offset);
  };

  const offsetDecrease = () => {
    if (offset - 25 <= 0) {
      getResults(0);
    } else {
      getResults(offset - 25);
    }
    console.log(offset);
  };

  return (
    <div>
      <h2 className="rs-page-title">Results</h2>
      <h3>Summary</h3>
      <ResultsMetadata metadata={metadata} />
      <h3>All results</h3>
      <div className="rs-row" style={rowStyle}>
        <div className="span-1">
          <a style={buttonStyle} href="#" onClick={offsetDecrease}>
            Previous
          </a>
        </div>
        <div className="span-1">
          <a style={buttonStyle} href="#" onClick={offsetIncrease}>
            Next
          </a>
        </div>
        <div className="span-10"></div>
      </div>
      <ResourceTable resources={results} type="results" />
    </div>
  );
};

export default ResultsView;
