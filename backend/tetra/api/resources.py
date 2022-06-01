"""
Copyright 2016 Rackspace

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
import falcon
import json

import xunitparser

from tetra.data.models.pipeline import Pipeline
from tetra.data.models.result import Result


def make_error_body(msg):
    return json.dumps({"error": msg})


class Resources(object):
    RESOURCE_CLASS = None

    def on_get(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_200
        kwargs.update(req.params)
        results = self.RESOURCE_CLASS.get_all(**kwargs)
        resp.body = json.dumps(results)

    def on_post(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_201
        data = req.stream.read()
        data_dict = json.loads(data)
        data_dict.update(kwargs)
        resource = self.RESOURCE_CLASS.from_dict(data_dict)
        created_resource = self.RESOURCE_CLASS.create(resource=resource)
        resp.body = json.dumps(created_resource.to_dict())


class Resource(object):
    RESOURCE_CLASS = None
    RESOURCE_ID_KEY = ""

    def on_get(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_200
        resource_id = kwargs.get(self.RESOURCE_ID_KEY)
        result = self.RESOURCE_CLASS.get(resource_id=resource_id)
        resp.content_type = "application/json"
        if result:
            resp.body = json.dumps(result.to_dict())
        else:
            resp.status = falcon.HTTP_404
            resp.body = make_error_body(
                "{0} {1} not found.".format(self.RESOURCE_CLASS.__name__, resource_id)
            )

    def on_delete(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_204
        resource_id = kwargs.get(self.RESOURCE_ID_KEY)
        self.RESOURCE_CLASS.delete(resource_id=resource_id)


class PipelineResource(Resources):
    ROUTE = "/pipelines"
    RESOURCE_CLASS = Pipeline

    def on_post(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_201
        data = req.stream.read()
        data_dict = json.loads(data)
        data_dict.update(kwargs)

        resource = self.RESOURCE_CLASS.from_dict(data_dict)
        created_resource = self.RESOURCE_CLASS.create(resource=resource)
        created_dict = created_resource.to_dict()
        resp.body = json.dumps(created_dict)


class PipelineResource(Resource):
    ROUTE = "/pipelines/{pipeline_id}"
    RESOURCE_CLASS = Pipeline
    RESOURCE_ID_KEY = "pipeline_id"


# class JobsResource(Resources):
#     ROUTE = "/builds/{build_id}/jobs"
#     RESOURCE_CLASS = Jobs


# class JobResource(Resource):
#     ROUTE = "/builds/{build_id}/jobs/{job_id}"
#     RESOURCE_CLASS = Jobs
#     RESOURCE_ID_KEY = "job_id"


class LastCountByStatusResultsResource(Resources):
    ROUTE = "/status/{status}/count/{count}"
    RESOURCE_CLASS = Result

    def on_get(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_200
        kwargs.update(req.params)
        results = self.RESOURCE_CLASS.get_last_count_by_status(**kwargs)
        resp.body = json.dumps(results)


class LastCountByTestNameResultsResource(Resources):
    ROUTE = "/test_name/{test_name}/count/{count}"
    RESOURCE_CLASS = Result

    def on_get(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_200
        kwargs.update(req.params)
        results = self.RESOURCE_CLASS.get_last_count_by_test_name(**kwargs)
        resp.body = json.dumps(results)


class ProjectResultsResource(Resources):
    ROUTE = "/results"
    RESOURCE_CLASS = Result


class ResultsResource(Resources):
    ROUTE = "/builds/{build_id}/results"
    RESOURCE_CLASS = Result

    def on_post(self, req, resp, **kwargs):
        if self._is_junit_xml_request(req):
            return self._on_post_junitxml(req, resp, **kwargs)
        return super(ResultsResource, self).on_post(req, resp, **kwargs)

    def _is_junit_xml_request(self, req):
        return req.content_type and "application/xml" in req.content_type

    def _on_post_junitxml(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_201

        suite, _ = xunitparser.parse(req.stream)
        results = [Result.from_junit_xml_test_case(case, **kwargs) for case in suite]
        response_data = Result.create_many(results, **kwargs)
        resp.body = json.dumps(response_data)


class ResultResource(Resource):
    ROUTE = "/builds/{build_id}/results/{result_id}"
    RESOURCE_CLASS = Result
    RESOURCE_ID_KEY = "result_id"
