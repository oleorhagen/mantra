import React from 'react';
import ResultsTable from './results-table';

class HistoryView extends React.Component {
    state = {
        results: []
    };

    testName() {
        const result = this.props.match.params.test_name || this.props.test_name;
        return encodeURIComponent(result);
    }

    componentDidMount() {
        const self = this;
        var url = `/api/projects/${self.props.match.params.project_id || self.props.project_id}/test_name/${self.testName()}/count/${self.props.match.params
            .count || self.props.count}`;
        self.historyResultsRequest = fetch(url)
            .then(response => response.json())
            .then(result => {
                self.setState({
                    results: result
                });
            });
    }

    componentWillUnmount() {
        // this.historyResultsRequest.abort();
    }

    render() {
        return (
            <div>
                <h2 className="rs-page-title">Test History</h2>
                <h3>Test Case {this.testName()}</h3>
                <ResultsTable results={this.state.results} />
            </div>
        );
    }
}

export default HistoryView;
