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

    def test_upload_test_results(self):
        for root, _, files in os.walk("test_resources"):
            i = 10000
            for name in sorted(files):
                _, suite_results, run_date = re.match(
                    r"([0-9]+)-([\w]+)@([0-9]{4}-[0-9]{2}-[0-9]{2}).xml", name
                ).groups()

                pipeline_name = "nightly-" + run_date

                with open(os.path.join(root, name)) as fd:
                    xml_result = fd.read()

                # Extract the name of the test
                m = re.match("[0-9]{1,2}-results_(.*)@.*", name)
                if not m:
                    sys.exit(1)

                #
                # TODO - fix proper build numbers
                #
                r = requests.post(
                    self._TETRA_API_BASE_URL + "results",
                    headers={"Content-type": "application/json"},
                    auth=HTTPBasicAuth(user, password),
                    data=json.dumps(
                        {
                            "pipeline_id": i + 1,  # TODO
                            "pipeline_name": pipeline_name,
                            "job_id": i + 2,  # TODO
                            "job_name": m.group(1),
                            "result": xml_result,
                        }
                    ),
                )
                i += 3
                assert r.ok
