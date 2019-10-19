import React from 'react';
import ResultsTable from './results-table';

var HistoryView = React.createClass({

    getInitialState: function() {
        return {
            results: []
        }
    },

    projectId: function() {
        return this.props.params.project_id || this.props.project_id;
    },

    testName: function() {
        const result = this.props.params.test_name || this.props.test_name;
        return encodeURIComponent(result);
    },

    count: function() {
        return this.props.params.count || this.props.count;
    },

    componentDidMount: function() {
        var url = "/api/projects/" + this.projectId() + "/test_name/" + this.testName() + "/count/" +
                this.count();
        this.historyResultsRequest = $.get(url, function(result) {
            this.setState({
                results: result
            })
        }.bind(this))
    },

    componentWillUnmount: function() {
        this.historyResultsRequest.abort();
    },

    render: function() {
        return (
            <div>
                <h2 className="rs-page-title">Test History</h2>
                <h3>Test Case {this.testName()}</h3>
                <ResultsTable results={this.state.results} />
            </div>
        );
    },

});

export default HistoryView;
