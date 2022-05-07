import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { AppBar, Button, IconButton, Stack, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';

import Link from './link';

const paths = [
  { title: 'Projects', location: '/projects' },
  { title: 'Build Status', location: '/build-status' },
  { title: 'Security Status', location: '/security-status' }
];

export const Navbar = () => {
  const [mode, setMode] = useState('light');
  const router = useRouter();
  const tabIndex = paths.findIndex(({ location }) => location === router.pathname);
  const [tabValue, setTabValue] = useState(tabIndex > -1 ? tabIndex : 0);
  const handleTabChange = (e, value) => setTabValue(value);

  useEffect(() => {
    if (!window) {
      return;
    }
    setMode(window.localStorage.getItem('mode') || 'light');
  }, []);

  const onModeToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    window.localStorage.setItem('mode', newMode);
    document.dispatchEvent(new Event('modeChanged'));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexGrow={1}>
          <Typography variant="h6" component={Link} href="/" color="inherit">
            Mantra
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} color="inherit" textColor="inherit">
            {paths.map(({ location, title }) => (
              <Tab key={location} color="inherit" label={title} component={Link} href={location} />
            ))}
          </Tabs>
          <IconButton onClick={onModeToggle} style={{ color: 'inherit' }}>
            {mode === 'light' ? <DarkModeIcon color="inherit" /> : <LightModeIcon color="inherit" />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
