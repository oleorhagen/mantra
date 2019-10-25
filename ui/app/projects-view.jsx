import React from 'react';
import ProjectsTable from './projects-table';

class ProjectsView extends React.Component {
    state = {
        projects: []
    };

    componentDidMount() {
        this.projectsRequest = fetch('http://localhost:7374/projects', result => {
            this.setState({
                projects: result
            });
        });
    }

    componentWillUnmount() {
        this.projectsRequest.abort();
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
