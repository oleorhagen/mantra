#!/usr/bin/env python3

import os
import sys
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tetrautils")
logger.setLevel(logging.INFO)


TEST_RESULTS_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "test_results"
)

MENDER_QA_TEST_SUITES = [
    {
        "name": "test_accep_qemux86_64_uefi_grub",
        "id": 1,
        "results_file": "results_accep_qemux86_64_uefi_grub",
    },
    {
        "name": "test_accep_vexpress_qemu",
        "id": 2,
        "results_file": "results_accep_vexpress_qemu",
    },
    {
        "name": "test_accep_qemux86_64_bios_grub",
        "id": 3,
        "results_file": "results_accep_qemux86_64_bios_grub",
    },
    {
        "name": "test_accep_qemux86_64_bios_grub_gpt",
        "id": 4,
        "results_file": "results_accep_qemux86_64_bios_grub_gpt",
    },
    {
        "name": "test_accep_vexpress_qemu_uboot_uefi_grub",
        "id": 5,
        "results_file": "results_accep_vexpress_qemu_uboot_uefi_grub",
    },
    {
        "name": "test_accep_vexpress_qemu_flash",
        "id": 6,
        "results_file": "results_accep_vexpress_qemu_flash",
    },
    {
        "name": "test_backend_integration",
        "id": 7,
        "results_file": "results_backend_integration_open",
    },
    {
        "name": "test_backend_integration",
        "id": 8,
        "results_file": "results_backend_integration_enterprise",
    },
    {
        "name": "test_full_integration",
        "id": 9,
        "results_file": "results_full_integration",
    },
]

_TETRA_API_HOST = "localhost"
_TETRA_API_BASE_URL = "http://{}/api/".format(_TETRA_API_HOST)

TETRA_API_PROJECTS_URL = _TETRA_API_BASE_URL + "projects"
TETRA_API_BUILDS_URL_FMT = _TETRA_API_BASE_URL + "projects/{project_id}/builds"
TETRA_API_RESULTS_URL_FMT = (
    _TETRA_API_BASE_URL + "projects/{project_id}/builds/{build_id}/results"
)


def get_tetra_credentials():
    user = os.getenv("TETRA_USER")
    password = os.getenv("TETRA_PASSWORD")
    if user is None or password is None:
        logger.error("TETRA_USER or TETRA_PASSWORD not found in user environment")
        sys.exit(1)
    return user, password
