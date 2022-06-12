"""
Copyright 2016 Rackspace

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
import time

from sqlalchemy import desc
from sqlalchemy.sql import func, select, and_

from qaportal.data import sql
from qaportal.data.db_handler import get_handler
from qaportal.data.models.base import BaseModel, truncate
from qaportal.data.models.job import Job
from qaportal.data.models.result_metadata import ResultMetadata


class Result(BaseModel):

    TABLE = sql.results_table

    def __init__(
        self,
        **kwargs,
    ):
        self.test_name = truncate(
            kwargs["test_name"], self.TABLE.c.test_name.type.length
        )
        self.job_id = int(kwargs["job_id"])
        self.timestamp = int(kwargs.get("timestamp", time.time()))
        self.result = truncate(kwargs["result"], self.TABLE.c.result.type.length)
        self.result_message = kwargs.get("result_message", "")
        self.tags = kwargs.get("tags", {})

    @classmethod
    def from_junit_xml_test_case(cls, case, job_id):
        if case.success:
            result_type = "passed"
        elif case.skipped:
            result_type = "skipped"
        elif case.failed:
            result_type = "failed"
        elif case.errored:
            result_type = "error"
        else:
            result_type = "unknown"

        return Result(
            test_name=case.id(),
            result=result_type,
            job_id=job_id,
            result_message=case.trace,
        )

    @classmethod
    def create_many(cls, resources, handler=None, **kwargs):
        handler = handler or get_handler()
        super(cls, Result).create_many(resources, handler=handler)

        metadata = ResultMetadata.from_results_list(resources)

        results_dict = {
            "metadata": metadata.to_dict(),
        }
        return results_dict
