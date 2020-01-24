import React from 'react';
import BuildsTable from './builds-table';

class BuildsView extends React.Component {
    state = {
        builds: []
    };

    componentDidMount() {
        const self = this;
        var url = `/api/projects/${self.props.params.project_id || self.props.project_id}/builds`;
        self.buildsRequest = fetch(url).then(response => response.json()).then( result => {
            self.setState({
                builds: result
            });
        });
    }

    componentWillUnmount() {
        // this.buildsRequest.abort();
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
