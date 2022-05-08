import React from 'react';

import { useRouter } from 'next/router';

import BuildStatus from './build-status';
import ProjectsView from './projects';
import SecurityStatus from './security-status';

export const paths = [
  { title: 'Projects', location: '/projects', component: ProjectsView },
  { title: 'Build Status', location: '/build-status', component: BuildStatus },
  { title: 'Security Status', location: '/security-status', component: SecurityStatus }
];

const Index = () => {
  const router = useRouter();
  const tabIndex = paths.findIndex(({ location }) => location === router.pathname);
  const Component = paths[tabIndex > -1 ? tabIndex : 0].component;
  return <Component />;
};

export default Index;
