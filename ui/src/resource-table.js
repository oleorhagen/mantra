import React from 'react';

import { DataGrid, GridToolbar, LinearProgress, CustomNoRowsOverlay } from '@mui/x-data-grid';

import { useRouter } from 'next/router';

import ResourceTableEntry from './resource-table-entry';

import Link from '../components/link';

const tableColumnDefinitions = {
  builds: [
    {
      field: 'id',
      headerName: 'Build ID',
    },
    {
      field: 'pipeline_id',
      headerName: 'Project ID',
    },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: params => <Link href={`/pipelines/${params.row.pipeline_id}/jobs/${params.row.id}`}> {params.row.name} </Link>,
      minWidth: 200,
    },
    {
      field: 'build_url',
      headerName: 'Build URL',
    },
    {
      field: 'region',
      headerName: 'Region',
    },
    {
      field: 'environment',
      headerName: 'Environment',
    },
    {
      field: 'show_failed',
      headerName: 'Failed?',
    },
  ],
  pipelines: [
    {
      field: 'id',
      headerName: 'GitLab Pipeline ID',
      minWidth: 100,
      renderCell: params => <Link href={`https://gitlab.com/Northern.tech/Mender/mender-api-docs/-/pipelines/${params.row.id}`}> {params.row.id} </Link>,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 250,
      renderCell: params => <Link href={`/pipelines/${params.row.id}/jobs`}> {params.row.name} </Link>,
    },
  ],
  results: [
    {
      field: 'id',
      headerName: 'Build ID',
      minWidth: 150,
      sortable: false,
      renderCell: params => <Link href={`/projects/${params.row.project_id}/builds/${params.row.id}`}> {params.row.id} </Link>,
      editable: false,
    },
    {
      field: 'project_id',
      headerName: 'Project ID',
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: params => <Link href={`/projects/${params.row.project_id}/builds`}> {params.row.project_id} </Link>,
      editable: false,
    },
    {
      field: 'result',
      headerName: 'Result',
      minWidth: 110,
      renderCell: params => {
        var color = 'green';
        if (params.row.result != 'passed') {
          color = 'red';
        }
        return (
          <div
            style={{
              color: color,
            }}
          >
            {' '}
            {params.row.result}{' '}
          </div>
        );
      },
      sortable: true,
    },
    {
      field: 'resultMessage',
      headerName: 'ResultMessage',
      sortable: false,
      minWidth: 110,
    },
    {
      field: 'testName',
      headerName: 'Test Name',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      minMinWidth: 260,
      flex: 1,
      // valueGetter: params => `/projects/${params.row.project_id}/tests/history?name=${encodeURIComponent(params.row.test_name)}&count=10`,
      // renderCell: params => (
      //   <Link href={`/projects/${params.row.project_id}/tests/history?name=${encodeURIComponent(params.row.test_name)}&count=10`}>
      //     {' '}
      //     {params.row.test_name}{' '}
      //   </Link>
      // ),
    },
    {
      field: 'tags',
      headerName: 'Tags',
      sortable: true,
      renderCell: params => {
        if (params.row.tags.nightly) {
          return (
            <div
              style={{
                color: 'orange',
              }}
            >
              {' '}
              nightly{' '}
            </div>
          );
        }
        return '';
      },
      minWidth: 100,
    },
    {
      field: 'timestamp',
      headerName: 'TimeStamp',
      sortable: true,
      valueGetter: params => {
        const date = new Date(params.row.timestamp * 1000);
        return date.toUTCString();
      },
      minWidth: 200,
    },
  ],
};

const ResourceTable = ({ resources, type }) => {
  console.log('Resources:');
  console.log(resources);
  console.log('type');
  console.log(type);

  const columns = tableColumnDefinitions[type];

  const rows = resources;

  return (
    <DataGrid
      autoHeight
      showQuickFilter
      // TODO - this is only really for the results...
      /* initialState={{ */
      /*   sorting: { */
      /*     sortModel: [ */
      /*       { */
      /*         field: 'result', */
      /*         sort: 'asc', */
      /*       }, */
      /*     ], */
      /*   }, */
      /* }} */
      rows={rows}
      columns={columns}
      pageSize={50}
      rowsPerPageOptions={[50]}
      disableSelectionOnClick
      disableColumnSelector
      disableDensitySelector
      components={{
        Toolbar: GridToolbar,
        LoadingOverlay: LinearProgress,
        NoRowsOverlay: CustomNoRowsOverlay,
      }}
      componentsProps={{
        toolbar: {
          /* showQuickFilter: true, // Quero no worko? */
          // quickFilterProps: {
          //   debounceMs: 500,
          // },
        },
      }}
    />
  );
};

export default ResourceTable;
