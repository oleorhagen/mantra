import React from 'react';
import ProjectsTable from './projects-table';

class ProjectsView extends React.Component {
    state = {
        projects: []
    };

    componentDidMount() {
        const self = this;
        self.projectsRequest = fetch('/api/projects').then(response => response.json()).then(result => {
            self.setState({
                projects: result
            });
        });
    }

    componentWillUnmount() {
        // this.projectsRequest.abort();
    }

    render() {
        return (
            <div>
                <h2 className="rs-page-title">Projects</h2>
                <ProjectsTable projects={this.state.projects} />
            </div>
        );
    }
}

export default ProjectsView;
