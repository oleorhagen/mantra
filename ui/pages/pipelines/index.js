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
            query GetAllPipelines {
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

        const latestPipelines = await request({
            url: 'http://localhost/graphql',
            document: query,
        });
        console.log(`latestPipelines: ${latestPipelines}`);
        const {
            allPipelines: {
                nodes
            }
        } = latestPipelines;
        console.log(`nodes: ${nodes}`);
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