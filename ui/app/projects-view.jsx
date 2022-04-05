import React, { useEffect, useState } from 'react';

import ResourceTable from './resource-table';

const ProjectsView = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const projectsRequest = fetch('/api/projects')
      .then((response) => response.json())
      .then((result) => setProjects(result));
    return () => {
      projectsRequest.abort();
    };
  }, []);

  return (
    <div>
      <h2 className="rs-page-title">Projects</h2>
      <ResourceTable resources={projects} type="projects" />
    </div>
  );
};

export default ProjectsView;
