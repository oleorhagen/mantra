import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
      name: (build) => `/projects/${build.project_id}/builds/${build.id}`,
      id: (build) => `/projects/${build.project_id}/builds/${build.id}`,
      show_failed: (build) => `/projects/${build.project_id}/builds/last_failed/?name=${encodeURIComponent(build.name)}&count=10`
    }
  },
  results: {
    titles: ['Id', 'Build Id', 'Project Id', 'Result', 'Result Message', 'Test Name', 'Timestamp'],
    keys: ['id', 'build_id', 'project_id', 'result', 'result_message', 'test_name', 'timestamp'],
    links: {
      project_id: (r) => `/projects/${r.project_id}/builds`,
      test_name: (r) => `/projects/${r.project_id}/tests/history?name=${encodeURIComponent(r.test_name)}&count=10`
    }
  }
};

const ResourceTable = ({ resources, type }) => {
  const { titles: columnTitles, keys: columnKeys, links: columnLinks } = tableTypes[type];
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {columnTitles.map((title, index) => (
              <TableCell key={index}>{title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map((resource, i) => (
            <ResourceTableEntry key={i} resource={resource} columnKeys={columnKeys} columnLinks={columnLinks} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResourceTable;
