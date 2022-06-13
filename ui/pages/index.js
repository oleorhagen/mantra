import React from 'react';

import { useRouter } from 'next/router';

import BuildStatus from './build-status';
import ProjectsView from './projects';
import Nightlies from './nightlies';
import SecurityStatus from './security-status';

export const paths = [
  { title: 'Projects', location: '/projects', component: ProjectsView },
  { title: 'Build Status', location: '/build-status', component: BuildStatus },
  { title: 'Nigthlies', location: '/nightlies', component: Nightlies },
  { title: 'Security Status', location: '/security-status', component: SecurityStatus }
];

const Index = () => {
  const router = useRouter();
  const tabIndex = paths.findIndex(({ location }) => location.startsWith(router.pathname));
  const Component = paths[tabIndex > -1 ? tabIndex : 0].component;
  return <Component />;
};

export default Index;
