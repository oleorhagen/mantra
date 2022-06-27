#!/usr/bin/env python3

import os
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tetrautils")
logger.setLevel(logging.INFO)


TEST_RESULTS_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "test_results"
)

_QAPORTAL_API_HOST = os.getenv("QAPORTAL_API_HOST", "http://localhost")
_QAPORTAL_API_BASE_URL = "{}/api/".format(_QAPORTAL_API_HOST)

def get_tetra_credentials():
    user = os.getenv("TETRA_USER")
    password = os.getenv("TETRA_PASSWORD")
    if user is None or password is None:
        logger.warning("TETRA_USER or TETRA_PASSWORD not found in user environment")
    return user, password
