import React from 'react';

const ResultsMetadata = ({ metadata }) => (
  <ul className="rs-detail-list">
    {Object.entries(metadata).map(([key, value], index) => (
      <li key={index} className="rs-detail-item">
        <div className="rs-detail-key">{key}</div>
        <div className="rs-detail-value">{value}</div>
      </li>
    ))}
  </ul>
);

export default ResultsMetadata;
