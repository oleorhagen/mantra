import React from 'react';
import ResultsTable from './results-table';

class LastFailedView extends React.Component {
    /**
     * This will populate all failed tests and how many times each failed
     * in the last <count> executions for a specific build.
     */
    state = {
        results: []
    };

    buildName() {
        const result = this.props.params.build_name || this.props.build_name;
        return encodeURIComponent(result);
    }

    componentDidMount() {
        var url = `/api/projects/${this.props.params.project_id || this.props.project_id}/status/failed/count/${this.props.params.count ||
            this.props.count}?build_name=${this.buildName()}`;
        this.lastFailedResultsRequest = fetch(url, result => {
            this.setState({
                results: result
            });
        });
    }

    componentWillUnmount() {
        this.lastFailedResultsRequest.abort();
    }

    render() {
        return (
            <div>
                <h2 className="rs-page-title">Last Failed</h2>
                <h3>Failed results</h3>
                <ResultsTable results={this.state.results} />
            </div>
        );
    }
}

export default LastFailedView;
