import React from 'react';

import { request, gql } from 'graphql-request';

import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography } from '@mui/material';
import { Circle, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import Link from '../components/link';

const areas = {
  backend: 'backend',
  client: 'client',
  frontend: 'frontend',
  qa: 'qa'
};

const repos = [
  { repo: 'auditlogs', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'create-artifact-worker', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'deployments', staging: false, isExecutable: false, area: areas.backend },
  { repo: 'deployments-enterprise', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'deviceauth', staging: false, isExecutable: false, area: areas.backend },
  { repo: 'deviceauth-enterprise', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'deviceconfig', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'deviceconnect', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'devicemonitor', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'go-lib-micro', staging: false, isExecutable: false, area: areas.backend },
  { repo: 'gui', staging: true, isExecutable: false, area: areas.frontend },
  { repo: 'integration-test-runner', staging: false, isExecutable: false, area: areas.qa },
  { repo: 'integration', staging: true, isExecutable: false, area: areas.qa },
  { repo: 'inventory', staging: false, isExecutable: false, area: areas.backend },
  { repo: 'inventory-enterprise', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'iot-manager', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'mender', staging: true, isExecutable: true, area: areas.client },
  { repo: 'mender-api-gateway-docker', staging: false, isExecutable: false, area: areas.backend },
  { repo: 'mender-artifact', staging: true, isExecutable: true, area: areas.client },
  { repo: 'mender-binary-delta', staging: true, isExecutable: true, area: areas.client },
  { repo: 'mender-cli', staging: true, isExecutable: true, area: areas.backend },
  { repo: 'mender-configure-module', staging: true, isExecutable: true, area: areas.client },
  { repo: 'mender-connect', staging: true, isExecutable: true, area: areas.client },
  { repo: 'mender-convert', staging: true, isExecutable: true, area: areas.client },
  { repo: 'mender-demo-artifact', staging: false, isExecutable: false, area: areas.frontend },
  { repo: 'mender-dist-packages', staging: false, isExecutable: false, area: areas.client },
  { repo: 'mender-gateway', staging: true, isExecutable: true, area: areas.backend },
  { repo: 'mender-image-tests', staging: false, isExecutable: false, area: areas.client },
  { repo: 'mender-stress-test-client', staging: false, isExecutable: false, area: areas.qa },
  { repo: 'mender-test-containers', staging: false, isExecutable: false, area: areas.qa },
  { repo: 'mendertesting', staging: false, isExecutable: false, area: areas.qa },
  { repo: 'meta-mender', staging: true, isExecutable: false, area: areas.client },
  { repo: 'mtls-ambassador', staging: true, isExecutable: true, area: areas.backend },
  { repo: 'openssl', staging: false, isExecutable: false, area: areas.client },
  { repo: 'progressbar', staging: false, isExecutable: false, area: areas.client },
  { repo: 'reporting', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'tenantadm', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'useradm', staging: false, isExecutable: false, area: areas.backend },
  { repo: 'useradm-enterprise', staging: true, isExecutable: false, area: areas.backend },
  { repo: 'workflows', staging: false, isExecutable: false, area: areas.backend },
  { repo: 'workflows-enterprise', staging: true, isExecutable: false, area: areas.backend }
];

const defaultRepoMap = repo => ({ repo });

const RepoStatusItem = ({ repo, organization = 'Mender', branch = 'master' }) => (
  <Stack direction="row" alignContent="center" spacing={1}>
    <Link href={`https://gitlab.com/Northern.tech/${organization}/${repo}/-/pipelines`}>
      <img alt={`${repo} ${branch} build-status`} src={`https://gitlab.com/Northern.tech/${organization}/${repo}/badges/${branch}/pipeline.svg`} />
    </Link>
    <Link href={`https://gitlab.com/Northern.tech/${organization}/${repo}/-/commits/${branch}`}>
      <Typography variant="subtitle2">
        {repo} {branch !== 'master' ? branch : ''}
      </Typography>
    </Link>
  </Stack>
);

const BuildStatus = ({ componentsByArea, latestNightly, ltsReleases, versions }) => {
  const openNightlyClick = () => window.open(`https://gitlab.com${latestNightly.path}`, '_newtab');

  return (
    <>
      <Stack direction="row" justifyContent="space-between" marginBottom={2}>
        <Typography variant="h4">Build Status</Typography>
        <Button
          variant="outlined"
          title={latestNightly.startedAt}
          onClick={openNightlyClick}
          endIcon={<Circle color={latestNightly.status === 'FAILED' ? 'error' : 'success'} />}
        >
          latest Nightly
        </Button>
      </Stack>

      {Object.entries(componentsByArea).map(([area, repos]) => (
        <Accordion key={area} defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={area}>
            {area}
          </AccordionSummary>
          <AccordionDetails>
            {repos.map(({ repo, branches = ['master'], organization }) =>
              branches.map(branch => <RepoStatusItem key={`${repo}-${branch}`} repo={repo} branch={branch} organization={organization} />)
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {Object.entries(versions).map(([version, repos], index) => {
        const isLtsRelease = ltsReleases.includes(version);
        return (
          <Accordion key={version} defaultExpanded={index === 0 || isLtsRelease} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${version}-header`}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Mender {version}</Typography>
                {isLtsRelease && <Typography variant="button">LTS</Typography>}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {repos.map(({ name, version }) => (
                <RepoStatusItem key={name} repo={name} branch={version} />
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

const transformReposIntoAreas = () =>
  repos.reduce(
    (accu, item) => {
      if (!Array.isArray(accu[item.area])) {
        accu[item.area] = [];
      }
      accu[item.area].push(item.repo);
      if (item.staging) {
        accu.stagingRepos.push(item.repo);
      }
      if (item.isExecutable) {
        accu.executableRepos.push(item.repo);
      }
      return accu;
    },
    { ...areas, stagingRepos: [], executableRepos: [] }
  );

const extractReleaseInfo = releaseInfo =>
  Object.values(releaseInfo).reduce(
    (result, release) => {
      let minorVersion = {
        ...result,
        firstReleaseDate: !result.firstReleaseDate || release.release_date < result.releaseDate ? release.release_date : result.firstReleaseDate
      };
      if (release.repos && release.release_date > minorVersion.releaseDate) {
        minorVersion = { ...minorVersion, releaseDate: release.release_date, repos: release.repos };
      }
      return minorVersion;
    },
    { firstReleaseDate: '', releaseDate: '', repos: [] }
  );

const collectStagingInfo = (result, repos, clientRepos, stagingRepos, executableRepos) => {
  if (result) {
    return result;
  }
  return repos.reduce((accu, repo) => {
    if (!stagingRepos.includes(repo.name)) {
      return accu;
    }
    accu.push({ ...repo, version: clientRepos.includes(repo.name) || executableRepos.includes(repo.name) ? repo.version : 'staging' });
    return accu;
  }, []);
};

export async function getStaticProps() {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
  const aYearAgo = cutoffDate.toISOString().split('T')[0];
  const versionsInfo = await fetch('https://docs.mender.io/releases/versions.json');
  const versions = await versionsInfo.json();
  const { backend: backendRepos, client: clientRepos, executableRepos, frontend: frontendRepos, qa: qaRepos, stagingRepos } = transformReposIntoAreas();
  const shownVersions = Object.entries(versions.releases).reduce((accu, [version, releaseInfo]) => {
    const { firstReleaseDate, repos } = extractReleaseInfo(releaseInfo);
    if (firstReleaseDate < aYearAgo && !versions.lts.includes(version)) {
      return accu;
    }
    accu.staging = collectStagingInfo(accu.staging, repos, clientRepos, stagingRepos, executableRepos);
    accu[version] = repos.map(repo => ({ ...repo, version: `${repo.version.substring(0, repo.version.lastIndexOf('.'))}.x` }));
    return accu;
  }, {});

  const componentsByArea = {
    backend: backendRepos.map(defaultRepoMap),
    client: clientRepos.map(defaultRepoMap),
    frontend: frontendRepos.map(defaultRepoMap),
    saas: [{ repo: 'mender-helm' }, { repo: 'saas', organization: 'MenderSaas' }, { repo: 'saas-tools' }, { repo: 'sre-tools' }],
    docs: [{ repo: 'mender-docs', branches: ['master', 'hosted'] }, { repo: 'mender-docs-site' }, { repo: 'mender-api-docs' }],
    qa: qaRepos.map(defaultRepoMap)
  };

  const query = gql`
    query getPipeline($date: Time) {
      project(fullPath: "Northern.tech/Mender/mender-qa") {
        pipelines(source: "schedule", ref: "master", last: 1, updatedAfter: $date) {
          edges {
            node {
              path
              status
              startedAt
            }
          }
        }
      }
    }
  `;

  const today = new Date().toISOString().split('T')[0];
  const latestNightly = await request({
    url: 'https://gitlab.com/api/graphql',
    variables: { date: today },
    document: query,
    requestHeaders: { Authorization: `Bearer ${process.env.GITLAB_TOKEN}` }
  });
  const {
    project: {
      pipelines: { edges }
    }
  } = latestNightly;
  return {
    props: {
      componentsByArea,
      latestNightly: edges[0].node,
      ltsReleases: versions.lts,
      versions: shownVersions
    }
  };
}

export default BuildStatus;
