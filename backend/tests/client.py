import json

import requests

from tests.config import cfg
from tests.log import log_response


class BaseClient(object):

    @classmethod
    def get(cls):
        return cls(cfg.CONF.api.base_url)

    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')

    def url(self, *args):
        parts = [self.base_url]
        parts.extend([str(x).lstrip('/') for x in args])
        return '/'.join(parts)


class VersionClientMixin(BaseClient):

    @log_response
    def list_versions(self, params=None):
        return requests.get(self.url('/'), params=params)


class ProjectClientMixin(BaseClient):

    @log_response
    def list_projects(self, params=None):
        return requests.get(self.url('/projects'), params=params)

    @log_response
    def create_project(self, data, params=None):
        url = self.url('/projects')
        return requests.post(url, data=json.dumps(data), params=params)

    @log_response
    def get_project(self, project_id, params=None):
        url = self.url('/projects', project_id)
        return requests.get(url, params=params)

    @log_response
    def delete_project(self, project_id, params=None):
        url = self.url('/projects', project_id)
        return requests.delete(url, params=params)


class BuildClientMixin(BaseClient):

    @log_response
    def list_builds(self, project_id, params=None):
        url = self.url('/projects', project_id, '/builds')
        return requests.get(url, params=params)

    @log_response
    def create_build(self, project_id, data, params=None):
        url = self.url('/projects', project_id, '/builds')
        return requests.post(url, data=json.dumps(data), params=params)

    @log_response
    def get_build(self, project_id, build_id, params=None):
        url = self.url('/projects', project_id, '/builds', build_id)
        return requests.get(url, params=params)

    @log_response
    def delete_build(self, project_id, build_id, params=None):
        url = self.url('/projects', project_id, '/builds', build_id)
        return requests.delete(url, params=params)


class ResultClientMixin(BaseClient):

    @log_response
    def list_project_results(self, project_id, params=None):
        url = self.url('/projects', project_id, '/results')
        return requests.get(url, params=params)

    @log_response
    def list_results(self, project_id, build_id, params=None):
        url = self.url('/projects', project_id,
                       '/builds', build_id, '/results')
        return requests.get(url, params=params)

    @log_response
    def create_result(self, project_id, build_id, data, params=None,
                      headers=None):
        url = self.url('/projects', project_id,
                       '/builds', build_id, '/results')
        return requests.post(url, data=json.dumps(data), params=params,
                             headers=headers)

    @log_response
    def create_result_junit_xml(self, project_id, build_id, data, params=None,
                                headers=None):
        url = self.url('/projects', project_id,
                       '/builds', build_id, '/results')
        return requests.post(url, data=data, params=params, headers=headers)

    @log_response
    def get_result(self, project_id, build_id, result_id, params=None):
        url = self.url('/projects', project_id,
                       '/builds', build_id, '/results', result_id)
        return requests.get(url, params=params)

    @log_response
    def delete_result(self, project_id, build_id, result_id, params=None):
        url = self.url('/projects', project_id,
                       '/builds', build_id, '/results', result_id)
        return requests.delete(url, params=params)


class LastCountByStatusClientMixin(BaseClient):

    @log_response
    def list_last_x_by_status_results(self, project_id,
                                      status, count, params=None):
        url = self.url('/projects', project_id,
                       '/status', status,
                       '/count', count)
        return requests.get(url, params=params)


class LastCountByTestNameClientMixin(BaseClient):

    @log_response
    def list_last_x_by_test_name_results(self, project_id,
                                         test_name, count, params=None):
        url = self.url('/projects', project_id,
                       '/test_name', test_name,
                       '/count', count)
        return requests.get(url, params=params)

class SpuriousFailuresClientMixIn(BaseClient):

    @log_response
    def list_spurious_failures(self, params=None):
        url = self.url('/spurious')
        return requests.get(url, params=params)


class TetraClient(
    VersionClientMixin,
    ProjectClientMixin,
    BuildClientMixin,
    ResultClientMixin,
    LastCountByStatusClientMixin,
    LastCountByTestNameClientMixin,
    SpuriousFailuresClientMixIn,
):
    pass
