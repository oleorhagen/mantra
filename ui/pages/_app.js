import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';

import { dark as darkTheme, light as lightTheme } from '../src/themes/Mender';
import createEmotionCache from '../src/createEmotionCache';
import Layout from '../components/layout';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }) => {
  const [mode, setMode] = useState('light');
  const modeChangedHandler = () => setMode(window.localStorage.getItem('mode') || 'light');
  useEffect(() => {
    if (!window) {
      return;
    }
    modeChangedHandler();
    document.addEventListener('modeChanged', modeChangedHandler, false);
  }, []);
  const theme = createTheme(mode === 'dark' ? darkTheme : lightTheme);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>QA-Portal</title>
        <meta charSet="utf-8" name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
