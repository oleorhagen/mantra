import { TableCell, TableRow } from '@mui/material';
import React from 'react';

import Link from '../components/link';

const ResourceTableEntry = ({ columnKeys, columnLinks, resource }) => {
  // todo: we need to be able to configure the column order
  const columns = (resource, columnKeys, columnLinks) => {
    var result = [];
    for (var i = 0; i < columnKeys.length; i++) {
      var key = columnKeys[i];
      var val = resource[key];
      if (columnLinks[key]) {
        var link = columnLinks[key](resource);
        // check if value exists.  This is useful for when you just want to
        // show actions
        if (val !== undefined) {
          result.push(
            <TableCell key={i} className="rs-table-link">
              <Link to={link}> {val} </Link>
            </TableCell>
          );
        } else {
          result.push(
            <TableCell key={i} className="rs-table-link">
              <Link to={link}>
                <button className="rs-btn rs-btn-primary">Go</button>
              </Link>
            </TableCell>
          );
        }
      } else {
        result.push(
          <TableCell key={i} className="rs-table-link">
            {' '}
            {val}{' '}
          </TableCell>
        );
      }
    }
    return result;
  };

  const status = (resource) => {
    var status = resource['result'] || resource['status'];
    if (status === 'failed' || status === 'error') {
      return <TableCell className="rs-table-status rs-table-status-error"> </TableCell>;
    } else if (status === 'skipped') {
      return <TableCell className="rs-table-status rs-table-status-warning"> </TableCell>;
    } else if (status === 'passed') {
      return <TableCell className="rs-table-status rs-table-status-ok"> </TableCell>;
    } else {
      return <TableCell className="rs-table-status rs-table-status-disabled"> </TableCell>;
    }
  };

  return (
    <TableRow>
      {status(resource)}
      {columns(resource, columnKeys, columnLinks)}
    </TableRow>
  );
};

export default ResourceTableEntry;
