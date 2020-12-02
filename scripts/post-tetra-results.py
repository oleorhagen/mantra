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
from common import MENDER_QA_TEST_SUITES
from common import TETRA_API_BUILDS_URL_FMT, TETRA_API_RESULTS_URL_FMT
from common import get_tetra_credentials

user, password = get_tetra_credentials()

# Pre-fetch all builds for all suites
builds = {}
for suite_id in [s["id"] for s in MENDER_QA_TEST_SUITES]:
    r = requests.get(
        TETRA_API_BUILDS_URL_FMT.format(project_id=suite_id),
        auth=HTTPBasicAuth(user, password),
    )
    if not r.ok:
        logger.error("Error(%d) %s" % (r.status_code, r.text))
        sys.exit(1)
    builds[suite_id] = r.json()

for root, _, files in os.walk(TEST_RESULTS_DIR):
    for name in sorted(files):
        logger.info("Uploading file " + name)
        project_id, suite_results, run_date = re.match(
            r"([0-9]+)-([\w]+)@([0-9]{4}-[0-9]{2}-[0-9]{2}).xml", name
        ).groups()
        logger.debug("Found project id " + suite_results)
        logger.debug("Found suite results " + suite_results)
        logger.debug("Found suite date " + run_date)

        project_id = int(project_id)
        build_name = "nightly-" + run_date

        found = [b for b in builds[project_id] if b["name"] == build_name]
        if len(found) > 0:
            logger.info("Project %d, build: %s already uploaded. Skipping" % (project_id, build_name))
            continue

        r = requests.post(
            TETRA_API_BUILDS_URL_FMT.format(project_id=project_id),
            auth=HTTPBasicAuth(user, password),
            data=json.dumps({"name": build_name}),
        )
        if not r.ok:
            logger.error("Error(%d) %s" % (r.status_code, r.text))
            sys.exit(1)
        j = r.json()
        logger.info("Created build: %s" % j)

        build_id = j["id"]
        url = TETRA_API_RESULTS_URL_FMT.format(project_id=project_id, build_id=build_id)

        with open(os.path.join(root, name)) as fd:
            content = fd.read()

        logger.debug("POST " + url)
        r = requests.post(
            url,
            auth=HTTPBasicAuth(user, password),
            data=content,
            headers={"Content-type": "application/xml"},
        )

        if not r.ok:
            logger.error("Error(%d) %s" % (r.status_code, r.text))
            sys.exit(1)
        j = r.json()
        logger.info("Created build: %s" % j)
