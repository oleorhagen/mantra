import {
    Typography
} from '@mui/material';

import {
    request,
    gql
} from 'graphql-request';

import React, {
    useEffect,
    useState
} from 'react';

import ResourceTable from '../../src/resource-table';

const PipelinesView = () => {
    const [pipelines, setPipelines] = useState([]);

    useEffect(() => {
        (async () => {
            const pipelines = await getPipelines();
            setPipelines(pipelines);
        })();
    }, []);

    const getPipelines = async () => {
        const query = gql`
                    query MyQuery {
                    allPipelines {
                        nodes {
                            id
                            name
                            status
                            tags
                        }
                    }
                    }
                    `;

        // const today = new Date().toISOString().split('T')[0];
        const latestPipelines = await request({
            url: 'http://localhost/graphql',
            // variables: {
            //     date: today
            // },
            document: query,
            // requestHeaders: {
            //     Authorization: `Bearer ${process.env.GITLAB_TOKEN}`
            // }
        });
        console.log(`latestPipelines: ${latestPipelines}`);
        // TODO - figure out the difference between the nodes and the edges query...
        const {
            allPipelines: {
                nodes
            }
        } = latestPipelines;
        console.log(`edges: ${nodes}`);
        return nodes;
    };

    return ( <
        >
        <
        Typography marginBottom = {
            2
        }
        variant = "h4" >
        Pipelines <
        /Typography> <
        ResourceTable resources = {
            pipelines
        }
        type = "pipelines" / >
        <
        />
    );
};

export default PipelinesView;