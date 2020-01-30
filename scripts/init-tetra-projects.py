#!/usr/bin/env python3

"""Creates a project for every test suite in Mender QA"""

import requests
from requests.auth import HTTPBasicAuth
import os
import sys
import json

from common import logger
from common import MENDER_QA_TEST_SUITES
from common import TETRA_API_PROJECTS_URL
from common import get_tetra_credentials

user, password = get_tetra_credentials()

r = requests.get(TETRA_API_PROJECTS_URL, auth=HTTPBasicAuth(user, password))
j = r.json()
if len(j) > 0:
    logger.warning("The following projects already exist:")
    logger.warning(j)
    logger.warning("Exiting")
    sys.exit(0)

for project in MENDER_QA_TEST_SUITES:
    logger.debug("Creating project %s" % project["name"])
    r = requests.post(
        TETRA_API_PROJECTS_URL,
        auth=HTTPBasicAuth(user, password),
        data=json.dumps({"name": project["name"]}),
    )
    if not r.ok:
        logger.error("Error(%d) %s" % (r.status_code, r.text))
        sys.exit(1)
    j = r.json()

    logger.debug("Got JSON: %s" % str(j))
    if j["id"] != project["id"]:
        logger.error("Expected id %d, got %d" % (project["id"], j["id"]))
        sys.exit(1)
    logger.info("Created project: %s" % j)
