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

// TODO - Rename to PipelinesView...
const ProjectsView = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        (async () => {
            const nightlies = await getNightlies();
            setProjects(nightlies);
        })();
    }, []);

    const getNightlies = async () => {
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
        const latestNightly = await request({
            url: 'http://localhost/graphql',
            // variables: {
            //     date: today
            // },
            document: query,
            // requestHeaders: {
            //     Authorization: `Bearer ${process.env.GITLAB_TOKEN}`
            // }
        });
        console.log(`latestNightly: ${latestNightly}`);
        // TODO - figure out the difference between the nodes and the edges query...
        const {
            allPipelines: {
                nodes
            }
        } = latestNightly;
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
            projects
        }
        type = "projects" / >
        <
        />
    );
};

export default ProjectsView;