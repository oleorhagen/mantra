import React from 'react';

import ResourceTableEntry from './resource-table-entry';

const tableTypes = {
  projects: {
    titles: ['Id', 'Name'],
    keys: ['id', 'name'],
    links: {
      name: (project) => `/projects/${project.id}/builds`,
      id: (project) => `/projects/${project.id}/builds`
    }
  },
  builds: {
    titles: ['Id', 'Project Id', 'Name', 'Build Url', 'Region', 'Environment', 'Show Failed'],
    keys: ['id', 'project_id', 'name', 'build_url', 'region', 'environment', 'show_failed'],
    links: {
      name: (build) => `/projects/${build.project_id}/builds/${build.id}/results`,
      id: (build) => `/projects/${build.project_id}/builds/${build.id}/results`,
      show_failed: (build) => `/projects/${build.project_id}/builds/${encodeURIComponent(build.name)}/last_failed/10`
    }
  },
  results: {
    titles: ['Id', 'Build Id', 'Project Id', 'Result', 'Result Message', 'Test Name', 'Timestamp'],
    keys: ['id', 'build_id', 'project_id', 'result', 'result_message', 'test_name', 'timestamp'],
    links: {
      project_id: (r) => `/projects/${r.project_id}/builds`,
      test_name: (r) => `/projects/${r.project_id}/tests/${encodeURIComponent(r.test_name)}/history/10`
    }
  }
};

const TableHeader = ({ headerName }) => (
  <th>
    <a href="#list-table" className="rs-table-sort">
      <span className="rs-table-sort-text">{headerName}</span>
      <span className="rs-table-sort-indicator"></span>
    </a>
  </th>
);

const ResourceTable = ({ resources, type }) => {
  const { titles: columnTitles, keys: columnKeys, links: columnLinks } = tableTypes[type];
  return (
    <table className="rs-list-table rs-embedded-list-table">
      <thead>
        <tr>
          <th className="rs-table-status"></th>
          {columnTitles.map((title, index) => (
            <TableHeader key={index} headerName={title} />
          ))}
        </tr>
      </thead>
      <tbody>
        {resources.map((resource, i) => (
          <ResourceTableEntry key={i} resource={resource} columnKeys={columnKeys} columnLinks={columnLinks} />
        ))}
      </tbody>
    </table>
  );
};

export default ResourceTable;
