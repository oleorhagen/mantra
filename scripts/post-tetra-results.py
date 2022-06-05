#!/usr/bin/env python3

"""Post results into tetra projects from local files"""

import requests
from requests.auth import HTTPBasicAuth
import os
import re
import sys
import json

from common import logger
from common import TEST_RESULTS_DIR
from common import _TETRA_API_HOST, _TETRA_API_BASE_URL
from common import get_tetra_credentials

user, password = get_tetra_credentials()

for root, _, files in os.walk(TEST_RESULTS_DIR):
    i = 0
    for name in sorted(files):
        logger.info("Uploading file " + name)
        _, suite_results, run_date = re.match(
            r"([0-9]+)-([\w]+)@([0-9]{4}-[0-9]{2}-[0-9]{2}).xml", name
        ).groups()
        logger.debug("Found project id " + suite_results)
        logger.debug("Found suite results " + suite_results)
        logger.debug("Found suite date " + run_date)

        pipeline_name = "nightly-" + run_date

        with open(os.path.join(root, name)) as fd:
            xml_result = fd.read()

        #
        # TODO - fix proper build numbers
        #
        r = requests.post(
            _TETRA_API_BASE_URL + "results",
            headers={"Content-type": "application/json"},
            auth=HTTPBasicAuth(user, password),
            data=json.dumps(
                {
                    "pipeline_id": i+1,  # TODO
                    "pipeline_name": pipeline_name,
                    "job_id": i+2,  # TODO
                    "job_name": "integration",  # TODO - This can probs be taken from the xml parsing
                    "result": xml_result,
                }
            ),
        )
        i += 3
        if not r.ok:
            logger.error("Error(%d) %s" % (r.status_code, r.text))
            sys.exit(1)
        # j = r.json()
        # logger.info("Created build: %s" % j)
