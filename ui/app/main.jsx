import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProjectsView from './projects-view';
import BuildsView from './builds-view';
import ResultsView from './results-view';
import LastFailedView from './last-failed-view';
import HistoryView from './history-view';

render(
  <BrowserRouter>
    <Routes>
      <Route path="/projects/:project_id/builds/:build_name/last_failed/:count" element={LastFailedView} />
      <Route path="/projects/:project_id/builds/:build_id/results" element={ResultsView} />
      <Route path="/projects/:project_id/builds" element={BuildsView} />
      <Route path="/projects/:project_id/tests/:test_name/history/:count" element={HistoryView} />
      <Route exact path="/" element={ProjectsView} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('content')
);
