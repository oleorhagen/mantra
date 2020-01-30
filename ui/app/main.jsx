import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProjectsView from './projects-view';
import BuildsView from './builds-view';
import ResultsView from './results-view';
import LastFailedView from './last-failed-view';
import HistoryView from './history-view';

render(
    <BrowserRouter>
        <Switch>
            <Route path="/projects/:project_id/builds/:build_name/last_failed/:count" component={LastFailedView} />
            <Route path="/projects/:project_id/builds/:build_id/results" component={ResultsView} />
            <Route path="/projects/:project_id/builds" component={BuildsView} />
            <Route path="/projects/:project_id/tests/:test_name/history/:count" component={HistoryView} />
            <Route exact path="/" component={ProjectsView} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('content')
);
