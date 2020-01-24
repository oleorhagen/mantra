#!/usr/bin/env python3

"""Get integration test results for recent nightlies

For the last 10 days, get the xml results available in GitLab"""

import requests
import os
import sys
import logging
from datetime import timedelta, date

from common import TEST_RESULTS_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tetrautils")
logger.setLevel(logging.INFO)

# Get token from env
token = os.getenv('GITLAB_TOKEN')
if token is None:
    logger.error("GITLAB_TOKEN not found in user environment")
    sys.exit(1)

base_url = "https://gitlab.com/api/v4/projects/12501706/"
pipelines_api = base_url + "pipelines/"
jobs_api = base_url + "jobs/"

def iterate_dates(start_date, delta_days=-1, total_days=-10):
    for delta in range(0, total_days, delta_days):
        yield start_date + timedelta(days=delta)

def iterate_nightlies(total_days=-10):
    # Filter with user that triggers master and nightlies:
    parameters_base = "username=lluiscampos"

    for single_date in iterate_dates(date.today(), total_days):
        single_date_str = single_date.strftime("%Y-%m-%d")
        logger.info("Looking for nightly " + single_date_str)
        for end_hour in range(2, 8):
            parameters = parameters_base + "&updated_after={}-{:02}-{:02}T01:00:00Z".format(
                single_date.year, single_date.month, single_date.day)
            parameters += "&updated_before={}-{:02}-{:02}T:{:02}:00:00Z".format(
                single_date.year, single_date.month, single_date.day, end_hour)
            url = "{url}?{params}".format(url=pipelines_api, params=parameters)
            logger.debug("Fetching URL: " + url)
            r = requests.get(url, headers={'PRIVATE-TOKEN': token})
            j = r.json()
            logger.debug("Got JSON: " + str(j))
            if len(j) > 0:
                nightly_id = j[0]["id"]
                logger.info("Found nightly " + str(nightly_id)  + " for " + single_date_str)
                yield single_date_str, j[0]["id"]
                break
        else:
            logger.error("Could not find nightly for " + single_date_str)

def fetch_and_save_last_10_nightlies():
    for date_str, nightly_id in iterate_nightlies(-10):

        #TODO CHECK NIGHTHLY HAS NO VARIABLES

        url = pipelines_api + str(nightly_id) + "/jobs"
        logger.debug("Fetching URL: " + url)
        r = requests.get(url, headers={'PRIVATE-TOKEN': token})
        j = r.json()
        logger.debug("Got JSON: " + str(j))

        integ_tests_job = [jj["id"] for jj in j if jj["name"] == "test_full_integration"]
        if len(integ_tests_job) == 0:
            jobs = [jj["name"] for jj in j]
            logger.error("Cannot fine test_full_integration in job list. Got: " + ",". join(jobs) )

        integ_tests_job = integ_tests_job[0]
        logger.info("Fetching XML results for test_full_integration")
        url = jobs_api + str(integ_tests_job) + "/artifacts/results_full_integration.xml"
        logger.debug("Fetching URL: " + url)
        r = requests.get(url, headers={'PRIVATE-TOKEN': token})

        filename = os.path.join(TEST_RESULTS_DIR, "results_full_integration" + date_str + ".xml")
        if not os.path.exists(filename):
            logger.info("Saving report in " + filename)
            with open(filename, "wb") as fd:
                fd.write(r.content)
        else:
            logger.info("Report " + filename + " already exists, skipping")


if __name__ == "__main__":
    fetch_and_save_last_10_nightlies()
