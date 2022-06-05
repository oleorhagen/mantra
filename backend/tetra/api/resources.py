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
from tetra.data.models.job import Job
from tetra.data.models.result import Result


def make_error_body(msg):
    return json.dumps({"error": msg})


class Resources(object):
    RESOURCE_CLASS = None

    def on_get(self, req, resp, **kwargs):
        resp.status = falcon.HTTP_200
        kwargs.update(req.params)
        print(f"on_get: args: {kwargs}")
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


class ResultsResource(Resources):
    ROUTE = "/results"
    RESOURCE_CLASS = Result

    def on_post(self, req, resp, **kwargs):
        # TODO - Check if JSON (parse response)
        resp.status = falcon.HTTP_500  # Standard is 500, unless we get 201 success
        try:
            data = json.load(req.stream)
            print(f"data received: {data}")
            # Create the Pipeline
            pipeline = Pipeline.from_dict(data)
            created_pipeline = Pipeline.create(resource=pipeline)
            try:
                test_suites = self._parse_xunitXML(data["result"])

                # data["job_name"] = test_suites["test_name"]

                # Create the Job
                job = Job.from_dict(data)
                created_job = Job.create(resource=job)
                # Create the Result

                results = [
                    Result.from_junit_xml_test_case(case, data["job_id"])
                    for case in test_suites
                ]
                resp.status = falcon.HTTP_201
                response_data = Result.create_many(results, **data)
                # TODO - is this needed (?)
                # resp.body = json.dumps(response_data)
            except Exception as e:
                print(f"Error parsing result XML: {e}")
                raise Exception(f"Error parsing result XML: {e}")
            # return super(ResultsResource, self).on_post(req, resp, **kwargs)
            # SUCCESS!
        except Exception as e:
            print(f"caught Exception: {e}")
            # TODO - use make_error_body perhaps (?)
            raise Exception(f"caught Exception: {e}")

    def _parse_xunitXML(self, results_xml_string):
        from io import StringIO

        result_stream = StringIO(results_xml_string)
        ts, tr = xunitparser.parse(result_stream)  # TODO - why ignore the test result?
        print(f"TestSuites: {ts}")
        print(f"TestResult: {tr}")
        return ts
