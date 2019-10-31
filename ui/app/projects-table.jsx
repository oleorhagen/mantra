import React from 'react';
import ResourceTable from './resource-table';

class ProjectsTable extends React.PureComponent {
    columnTitles = ['Id', 'Name'];
    columnKeys = ['id', 'name'];
    columnLinks = {
        name: function(project) {
            return '/projects/' + project.id + '/builds';
        },
        id: function(project) {
            return '/projects/' + project.id + '/builds';
        }
    };
    render() {
        return <ResourceTable resources={this.props.projects} columnTitles={this.columnTitles} columnKeys={this.columnKeys} columnLinks={this.columnLinks} />;
    }
}

export default ProjectsTable;
