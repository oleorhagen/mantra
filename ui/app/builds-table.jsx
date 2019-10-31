import React from 'react';
import ResourceTable from './resource-table';

class BuildsTable extends React.PureComponent {
    columnTitles = ['Id', 'Project Id', 'Name', 'Build Url', 'Region', 'Environment', 'Show Failed'];

    columnKeys = ['id', 'project_id', 'name', 'build_url', 'region', 'environment', 'show_failed'];

    columnLinks = {
        name: function(build) {
            return '/projects/' + build.project_id + '/builds/' + build.id + '/results';
        },
        id: function(build) {
            return '/projects/' + build.project_id + '/builds/' + build.id + '/results';
        },
        show_failed: function(build) {
            return '/projects/' + build.project_id + '/builds/' + encodeURIComponent(build.name) + '/last_failed/10';
        }
    };

    render() {
        return <ResourceTable resources={this.props.builds} columnTitles={this.columnTitles} columnKeys={this.columnKeys} columnLinks={this.columnLinks} />;
    }
}

export default BuildsTable;
