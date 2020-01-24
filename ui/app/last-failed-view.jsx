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
        const result = this.props.match.params.build_name || this.props.build_name;
        return encodeURIComponent(result);
    }

    componentDidMount() {
        const self = this;
        var url = `/api/projects/${self.props.match.params.project_id || self.props.project_id}/status/failed/count/${self.props.match.params.count ||
            self.props.count}?build_name=${self.buildName()}`;
        self.lastFailedResultsRequest = fetch(url)
            .then(response => response.json())
            .then(result => {
                self.setState({
                    results: result
                });
            });
    }

    componentWillUnmount() {
        // this.lastFailedResultsRequest.abort();
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
