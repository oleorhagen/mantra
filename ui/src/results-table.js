import React from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { DataGrid, GridToolbar, LinearProgress, CustomNoRowsOverlay } from '@mui/x-data-grid';

import ResourceTableEntry from './resource-table-entry';

import Link from '../components/link';

const ResultsTable = ({ resources }) => {
  const columns = [
    {
      field: 'id',
      headerName: 'Build ID',
      minWidth: 150,
      sortable: false,
      renderCell: params => <Link href={`/projects/${params.row.project_id}/builds/${params.row.id}`}>{params.row.id}</Link>,
      editable: false
    },
    {
      field: 'project_id',
      headerName: 'Project ID',
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: params => <Link href={`/projects/${params.row.project_id}/builds`}>{params.row.project_id}</Link>,
      editable: false
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
        return <div style={{ color: color }}>{params.row.result}</div>;
      },
      sortable: true
    },
    {
      field: 'result_message',
      headerName: 'ResultMessage',
      sortable: false,
      minWidth: 110
    },
    {
      field: 'test_name',
      headerName: 'Test Name',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      minMinWidth: 260,
      flex: 1,
      valueGetter: params => `/projects/${params.row.project_id}/tests/history?name=${encodeURIComponent(params.row.test_name)}&count=10`,
      renderCell: params => (
        <Link href={`/projects/${params.row.project_id}/tests/history?name=${encodeURIComponent(params.row.test_name)}&count=10`}>{params.row.test_name}</Link>
      )
    },
    {
      field: 'tags',
      headerName: 'Tags',
      sortable: true,
      renderCell: params => {
        if (params.row.tags.nightly) {
          return <div style={{ color: 'orange' }}>nightly</div>;
        }
        return '';
      },
      minWidth: 100
    },
    {
      field: 'timestamp',
      headerName: 'TimeStamp',
      sortable: true,
      valueGetter: params => {
        const date = new Date(params.row.timestamp * 1000);
        return date.toUTCString();
      },
      minWidth: 200
    }
  ];

  const rows = [
    {
      'id': 2921928,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_update_modules.TestUpdateModulesOpenSource.test_rootfs_update_module_success',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921927,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_update_modules.TestUpdateModulesOpenSource.test_rootfs_image_rejected',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921926,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Corrupted_script_version_in_data-test_set10]',
      'timestamp': 1653313815,
      'result': 'failed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921925,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_ArtifactCommit_Enter_script-test_set8]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921924,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Corrupted_script_version_in_etc-test_set11]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921923,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_ArtifactCommit_Leave_script-test_set9]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921922,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_Sync_Leave_script-test_set4]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921921,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_ArtifactInstall_Enter_script-test_set7]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921920,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_Download_Leave_script-test_set6]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921919,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_Download_Enter_script-test_set5]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921918,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_Sync_Enter_script-test_set3]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921917,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Normal_success-test_set0]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921916,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_Idle_Leave_script-test_set2]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921915,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_state_scripts[Failure_in_Idle_Enter_script-test_set1]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921914,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_reboot_recovery[simulate_powerloss_in_commit_enter-test_set1]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921913,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_reboot_recovery[simulate_powerloss_in_artifact_commit_leave-test_set2]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921912,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_state_scripts.TestStateScriptsOpenSource.test_reboot_recovery[simulate_powerloss_artifact_install_enter-test_set0]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921911,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_portforward.TestPortForwardOpenSource.test_portforward',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921910,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_signed_image_update.TestSignedUpdatesOpenSource.test_unsigned_artifact_fails_deployment[force_new]',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921909,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_signed_image_update.TestSignedUpdatesOpenSource.test_signed_artifact_success',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921908,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_preauth.TestPreauth.test_ok_preauth_and_remove',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921907,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_security.TestSecurityOpenSource.test_token_token_expiration',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921906,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_remote_terminal.TestRemoteTerminalOpenSource.test_portforward',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921905,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_security.TestSecurityOpenSource.test_ssl_only',
      'timestamp': 1653313815,
      'result': 'passed',
      'result_message': null,
      'tags': {}
    },
    {
      'id': 2921904,
      'project_id': 9,
      'build_id': 24314,
      'test_name': 'tests.test_preauth.TestPreauth.test_fail_preauth_existing',
      'timestamp': 1653313815,
      'result': 'error',
      'result_message': null,
      'tags': {}
    }
  ];

  return (
    <DataGrid
      autoHeight
      showQuickFilter // Adds a general search text input field
      initialState={{
        sorting: {
          sortModel: [{ field: 'result', sort: 'asc' }]
        }
      }}
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
        NoRowsOverlay: CustomNoRowsOverlay
      }}
      componentsProps={{
        toolbar: {
          showQuickFilter: true, // Quero no worko?
          quickFilterProps: { debounceMs: 500 }
        }
      }}
    />
  );
};

export default ResultsTable;
