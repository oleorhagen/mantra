import React from 'react';
import BuildsTable from './builds-table';

class BuildsView extends React.Component {
    state = {
        builds: []
    };

    componentDidMount() {
        var url = `/api/projects/${this.props.params.project_id || this.props.project_id}/builds`;
        this.buildsRequest = fetch(url, result => {
            this.setState({
                builds: result
            });
        });
    }

    componentWillUnmount() {
        this.buildsRequest.abort();
    }

    render() {
        return (
            <div>
                <h2 className="rs-page-title">Builds</h2>
                <BuildsTable builds={this.state.builds} />
            </div>
        );
    }
}

export default BuildsView;
