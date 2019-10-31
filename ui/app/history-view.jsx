import React from 'react';
import ResultsTable from './results-table';

class HistoryView extends React.Component {
    state = {
        results: []
    };

    testName() {
        const result = this.props.params.test_name || this.props.test_name;
        return encodeURIComponent(result);
    }

    componentDidMount() {
        var url = `/api/projects/${this.props.params.project_id || this.props.project_id}/test_name/${this.testName()}/count/${this.props.params.count ||
            this.props.count}`;
        this.historyResultsRequest = fetch(url, result => {
            this.setState({
                results: result
            });
        });
    }

    componentWillUnmount() {
        this.historyResultsRequest.abort();
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
