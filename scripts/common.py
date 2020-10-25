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
        "id": 1,
        "name": "test_accep_qemux86_64_uefi_grub",
        "job": "test_accep_qemux86_64_uefi_grub",
        "results_file": "results_accep_qemux86_64_uefi_grub",
    },
    {
        "id": 2,
        "name": "test_accep_vexpress_qemu",
        "job": "test_accep_vexpress_qemu",
        "results_file": "results_accep_vexpress_qemu",
    },
    {
        "id": 3,
        "name": "test_accep_qemux86_64_bios_grub",
        "job": "test_accep_qemux86_64_bios_grub",
        "results_file": "results_accep_qemux86_64_bios_grub",
    },
    {
        "id": 4,
        "name": "test_accep_qemux86_64_bios_grub_gpt",
        "job": "test_accep_qemux86_64_bios_grub_gpt",
        "results_file": "results_accep_qemux86_64_bios_grub_gpt",
    },
    {
        "id": 5,
        "name": "test_accep_vexpress_qemu_uboot_uefi_grub",
        "job": "test_accep_vexpress_qemu_uboot_uefi_grub",
        "results_file": "results_accep_vexpress_qemu_uboot_uefi_grub",
    },
    {
        "id": 6,
        "name": "test_accep_vexpress_qemu_flash",
        "job": "test_accep_vexpress_qemu_flash",
        "results_file": "results_accep_vexpress_qemu_flash",
    },
    {
        "id": 7,
        "name": "test_backend_integration_open",
        "job": "test_backend_integration",
        "results_file": "results_backend_integration_open",
    },
    {
        "id": 8,
        "name": "test_backend_integration_enterprise",
        "job": "test_backend_integration",
        "results_file": "results_backend_integration_enterprise",
    },
    {
        "id": 9,
        "name": "test_full_integration",
        "job": "test_full_integration",
        "results_file": "results_full_integration",
    },
]

_TETRA_API_HOST = os.getenv("TETRA_API_HOST", "https://qastatus.mender.io")
_TETRA_API_BASE_URL = "{}/api/".format(_TETRA_API_HOST)

TETRA_API_PROJECTS_URL = _TETRA_API_BASE_URL + "projects"
TETRA_API_BUILDS_URL_FMT = _TETRA_API_BASE_URL + "projects/{project_id}/builds"
TETRA_API_RESULTS_URL_FMT = (
    _TETRA_API_BASE_URL + "projects/{project_id}/builds/{build_id}/results"
)


def get_tetra_credentials():
    user = os.getenv("TETRA_USER")
    password = os.getenv("TETRA_PASSWORD")
    if user is None or password is None:
        logger.warning("TETRA_USER or TETRA_PASSWORD not found in user environment")
    return user, password
