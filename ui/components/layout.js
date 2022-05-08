import React from 'react';

import { Container } from '@mui/material';

import Navbar from './navbar';
import Footer from './footer';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <Container maxWidth="xl" sx={{ marginTop: theme => theme.spacing(4) }}>
      <main>{children}</main>
      <Footer />
    </Container>
  </>
);

export default Layout;
