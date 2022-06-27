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
from common import _QAPORTAL_API_HOST, _QAPORTAL_API_BASE_URL
from common import get_tetra_credentials

user, password = get_tetra_credentials()

# TODO - Yield pipeline ids
def pipeline_id(date):
    pipes = {}
    _id = 1
    while True:
        if date not in pipes.keys():
            pipes[date] = _id
            _id += 1
        yield pipes[date]

# TODO - yield job ids
def generate_job_id():
    i = 1000
    while True:
        yield i
        i += 1

for root, _, files in os.walk(TEST_RESULTS_DIR):
    pipeline_id = 1
    job_id = 1000
    pipes = {}
    for name in sorted(files):
        logger.info("Uploading file " + name)
        _, suite_results, run_date = re.match(
            r"([0-9]+)-([\w]+)@([0-9]{4}-[0-9]{2}-[0-9]{2}).xml", name
        ).groups()
        logger.info("Found project id " + suite_results)
        logger.info("Found suite results " + suite_results)
        logger.info("Found suite date " + run_date)

        if run_date not in pipes.keys():
            pipes[run_date] = pipeline_id
            pipeline_id += 1

        pipeline_name = "nightly-" + run_date

        with open(os.path.join(root, name)) as fd:
            xml_result = fd.read()

        # Extract the name of the job
        m = re.match("[0-9]{1,2}-results_(.*)@.*", name)
        if not m:
            sys.exit(1)


        logger.info(f"Job name: {m.group(1)}")

        logger.info(f"pipeline_id: {pipes[run_date]}")

        r = requests.post(
            _QAPORTAL_API_BASE_URL + "results",
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
        if not r.ok:
            logger.error("Error(%d) %s" % (r.status_code, r.text))
            sys.exit(1)
