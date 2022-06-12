from tests.base import BaseTetraTest

import requests
from requests.auth import HTTPBasicAuth
import os
import re
import sys
import json

user, password = os.getenv("TETRA_USER"), os.getenv("TETRA_PASSWORD")


class BaseUploadTest(BaseTetraTest):
    def setUp(self):
        super(BaseUploadTest, self).setUp()

    def tearDown(self):
        print("teardown")


class TestUploads(BaseUploadTest):

    _TETRA_API_HOST = os.getenv("TETRA_API_HOST", "http://localhost")
    _TETRA_API_BASE_URL = "{}/api/".format(_TETRA_API_HOST)

    TEST_RESOURCES_DIR = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "../test_resources"
    )

    def test_upload_test_results(self):
        fail = True
        for root, _, files in os.walk(self.TEST_RESOURCES_DIR):
            pipeline_id = 1
            job_id = 1000
            pipes = {}
            for name in sorted(files):
                _, suite_results, run_date = re.match(
                    r"([0-9]+)-([\w]+)@([0-9]{4}-[0-9]{2}-[0-9]{2}).xml", name
                ).groups()

                if run_date not in pipes.keys():
                    pipes[run_date] = pipeline_id
                    pipeline_id += 1

                pipeline_name = "nightly-" + run_date

                with open(os.path.join(root, name)) as fd:
                    xml_result = fd.read()

                # Extract the name of the job
                m = re.match("[0-9]{1,2}-results_(.*)@.*", name)
                if not m:
                    pytest.fail

                r = requests.post(
                    self._TETRA_API_BASE_URL + "results",
                    headers={"Content-type": "application/json"},
                    auth=HTTPBasicAuth(user, password),
                    data=json.dumps(
                        {
                            "pipeline_id": pipes[run_date],
                            "pipeline_name": pipeline_name,
                            "job_id": job_id,
                            "job_name": m.group(1),
                            "result": xml_result,
                        }
                    ),
                )
                job_id += 1
                assert r.ok
                fail = False
        assert not fail
