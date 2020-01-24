#!/usr/bin/env python3

"""Creates a project for every test suite in Mender QA"""

import requests
from requests.auth import HTTPBasicAuth
import os
import sys
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tetrautils")
logger.setLevel(logging.INFO)

MENDER_QA_TEST_SUITES = [
    "test_accep_qemux86_64_uefi_grub",
    "test_accep_vexpress_qemu",
    "test_accep_qemux86_64_bios_grub",
    "test_accep_qemux86_64_bios_grub_gpt",
    "test_accep_vexpress_qemu_uboot_uefi_grub",
    "test_accep_vexpress_qemu_flash",
    "test_accep_beagleboneblack",
    "test_accep_raspberrypi3",
    "test_backend_integration",
    "test_full_integration"
]

# Get token from env
user = os.getenv('TETRA_USER')
password = os.getenv('TETRA_PASSWORD')
if user is None or password is None:
    logger.error("TETRA_USER or TETRA_PASSWORD not found in user environment")
    sys.exit(1)

base_url = "http://localhost/api/"
projects_api = base_url + "projects"

r = requests.get(projects_api, auth=HTTPBasicAuth(user, password))
j = r.json()
if len(j) > 0:
    logger.warning("The following rojects already exist:")
    logger.warning(j)
    logger.warning("Exiting")
    sys.exit(0)

for project in MENDER_QA_TEST_SUITES:
    logger.debug("Creating project %s" % project)
    r = requests.post(projects_api,
            auth=HTTPBasicAuth(user, password),
            data=json.dumps({"name": project}))
    # import pdb; pdb.set_trace()
    if not r.ok:
        logger.error("Error(%d) %s" % (r.status_code, r.text))
        sys.exit(1)
    j = r.json()
    logger.info("Created project: %s" % j)
