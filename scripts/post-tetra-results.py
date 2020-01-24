#!/usr/bin/env python3

"""Creates a project for every test suite in Mender QA"""

import requests
from requests.auth import HTTPBasicAuth
import os
import re
import sys
import logging
import json

from common import TEST_RESULTS_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tetrautils")
logger.setLevel(logging.DEBUG)

MENDER_QA_TEST_SUITES = {
    "test_accep_qemux86_64_uefi_grub": "unknown",
    "test_accep_vexpress_qemu": "unknown",
    "test_accep_qemux86_64_bios_grub": "unknown",
    "test_accep_qemux86_64_bios_grub_gpt": "unknown",
    "test_accep_vexpress_qemu_uboot_uefi_grub": "unknown",
    "test_accep_vexpress_qemu_flash": "unknown",
    "test_accep_beagleboneblack": "unknown",
    "test_accep_raspberrypi3": "unknown",
    "test_backend_integration": "unknown",
    "test_full_integration": "results_full_integration"
}

# Get token from env
user = os.getenv('TETRA_USER')
password = os.getenv('TETRA_PASSWORD')
if user is None or password is None:
    logger.error("TETRA_USER or TETRA_PASSWORD not found in user environment")
    sys.exit(1)

base_url = "http://localhost/api/"
#TODO: fix projects
builds_api = base_url + "projects/{project_id}/builds".format(project_id=1)
results_api = base_url + "projects/{project_id}/builds/{build_id}/results"

for root, _, files in os.walk(TEST_RESULTS_DIR):
    for name in files:
        logger.info("Uploading file " + name )
        suite_results, run_date = re.match(r"([\w]+)([0-9]{4}-[0-9]{2}-[0-9]{2}).xml", name).groups()
        logger.debug("Found suite results " + suite_results)
        logger.debug("Found suite date " + run_date)
        suite_name = [k for k, v in MENDER_QA_TEST_SUITES.items() if v == suite_results ][0]
        logger.debug("Deduced suite name " + suite_name)

        # TODO
        # if suite_name == ....
        #    project = _____

        build_name = "nightly-" + run_date
        r = requests.post(builds_api,
                auth=HTTPBasicAuth(user, password),
                data=json.dumps({"name": build_name}))
        if not r.ok:
            logger.error("Error(%d) %s" % (r.status_code, r.text))
            sys.exit(1)
        j = r.json()
        logger.info("Created build: %s" % j)

        build_id = j["id"]
        url = results_api.format(project_id=1, build_id=build_id)

        with open(os.path.join(root, name)) as fd:
            content = fd.read()

        logger.debug("POST " + url)
        r = requests.post(url,
                auth=HTTPBasicAuth(user, password),
                data=content,
                headers={"Content-type": "application/xml"})

        # files=(
        #     ("description", (None, description)),
        #     ("size", (None, str(os.path.getsize(filename)))),
        #     ("artifact", (filename, open(filename, "rb"), "application/octet-stream")),
        # ),


        if not r.ok:
            logger.error("Error(%d) %s" % (r.status_code, r.text))
            sys.exit(1)
        j = r.json()
        logger.info("Created build: %s" % j)



    # r = requests.post(projects_api,
    #         auth=HTTPBasicAuth(user, password),
    #         data=json.dumps({"name": project}))
    # # import pdb; pdb.set_trace()
    # if not r.ok:
    #     logger.error("Error(%d) %s" % (r.status_code, r.text))
    #     sys.exit(1)
    # j = r.json()
    # logger.info("Created project: %s" % j)
