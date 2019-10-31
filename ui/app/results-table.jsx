import React from 'react';
import ResourceTable from './resource-table';

class ResultsTable extends React.PureComponent {
    columnTitles = ['Id', 'Build Id', 'Project Id', 'Result', 'Result Message', 'Test Name', 'Timestamp'];

    columnKeys = ['id', 'build_id', 'project_id', 'result', 'result_message', 'test_name', 'timestamp'];

    columnLinks = {
        project_id: function(r) {
            return '/projects/' + r.project_id + '/builds';
        },
        test_name: function(r) {
            return '/projects/' + r.project_id + '/tests/' + encodeURIComponent(r.test_name) + '/history/10';
        }
    };

    render() {
        return <ResourceTable resources={this.props.results} columnTitles={this.columnTitles} columnKeys={this.columnKeys} columnLinks={this.columnLinks} />;
    }
}

export default ResultsTable;
