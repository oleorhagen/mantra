import React, { useEffect, useState } from 'react';

import { Typography } from '@mui/material';

import { useRouter } from 'next/router';

// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const ResultMessageView = codeString => {
  return (
    <>
      <Typography href="/pipelines" variant="body2" color="text.primary" align="center">
        Test Log
      </Typography>
    </>
  );
};

export default ResultMessageView;
