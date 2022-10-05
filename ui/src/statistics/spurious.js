import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'test_name', headerName: 'Test Name', flex: 1 },
  { field: 'count', headerName: '# Failures', flex: 1 }
];

const SpuriousFailuresView = props => {
  const [value, setValue] = React.useState(new Date());

  const [results, setResults] = React.useState([]);

  const handleChange = newValue => {
    fetch(`/api/spurious/${newValue.unix()}`)
      .then(response => response.json())
      .then(result => {
        setResults(result);
      });
    setValue(newValue);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="DD/MM/YYYY"
          value={value}
          onChange={handleChange}
          disableFuture={true}
          maxDate={new Date()}
          minDate={new Date(2020, 1, 1)}
          renderInput={params => <TextField {...params} />}
        />
        <Box sx={{ height: 700, width: '100%' }}>
          <DataGrid getRowId={row => row.test_name} rows={results} columns={columns} pageSize={10} rowsPerPageOptions={[10]} disableSelectionOnClick />
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default SpuriousFailuresView;
