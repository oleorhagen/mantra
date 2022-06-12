import React from 'react';

import { DataGrid, GridToolbar, LinearProgress, CustomNoRowsOverlay } from '@mui/x-data-grid';

import { useRouter } from 'next/router';

import Link from '../components/link';

const tableColumnDefinitions = {
  jobs: [
    {
      field: 'id',
      headerName: 'Job ID',
      renderCell: params => {
        const router = useRouter();
        const { pipelineid } = router.query;
        return <Link href={`https://gitlab.com/Northern.tech/Mender/mender-qa/-/pipelines/${pipelineid}/jobs/${params.row.id}`}> {params.row.id} </Link>;
      },
    },
    {
      field: 'pipelineId',
      headerName: 'Project ID',
    },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: params => <Link href={`/pipelines/${params.row.pipeline_id}/jobs/${params.row.id}`}> {params.row.name} </Link>,
      minWidth: 200,
    },
    {
      field: 'buildUrl',
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
      field: 'showFailed',
      headerName: 'Failed',
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
      renderCell: params => (
        <Link href={`https://gitlab.com/Northern.tech/Mender/mender-api-docs/-/pipelines/${params.row.pipeline_id}/jobs/${params.row.id}`}>
          {' '}
          {params.row.id}{' '}
        </Link>
      ),
      editable: false,
    },
    {
      field: 'jobId',
      headerName: 'Job ID',
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: params => <Link href={`/pipelines/${params.row.id}/jobs/${params.row.jobId}/builds`}> {params.row.project_id} </Link>,
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
              color,
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
      flex: 1,
    },
    {
      field: 'testName',
      headerName: 'Test Name',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      minMinWidth: 260,
      flex: 1,
      // valueGetter: params => `/projects/${params.row.project_id}/tests/history?name=${encodeURIComponent(params.row.test_name)}&count=10`,
      renderCell: params => <Link href={`/tests/history?name=${encodeURIComponent(params.row.testName)}&count=10`}> {params.row.testName} </Link>,
    },
    {
      field: 'tags',
      headerName: 'Tags',
      sortable: true,
      renderCell: params => {
        if (params.row.tags && params.row.tags.nightly) {
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

  var _iState = {};
  if (type == 'results') {
    _iState = {
      sorting: {
        sortModel: [
          {
            field: 'result',
            sort: 'asc',
          },
        ],
      },
    };
  }

  return (
    <DataGrid
      autoHeight
      showQuickFilter
      initialState={_iState}
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
