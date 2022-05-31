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
from sqlalchemy import Table, Column, MetaData, ForeignKey, Index, Integer, String, Text

from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL

# plain JSON is inferior to JSONB in postgres.
# JSONB supports indexing and is stored as binary.
# TODO: other database support?
from sqlalchemy.dialects.postgresql import JSONB


metadata = MetaData()


projects_table = Table(
    "projects",
    metadata,
    Column("id", Integer, nullable=False, primary_key=True, autoincrement=True),
    Column("name", String(256), nullable=False),
)

# TODO - maybe add a timestamp here as well (?)
# TODO - rename to pipelines (?)
builds_table = Table(
    "builds",
    metadata,
    Column("build_id", Integer, nullable=False, primary_key=True), # CI_PIPELINE_ID
    Column(
        "project_id",
        ForeignKey(projects_table.c.id, ondelete="CASCADE"),
        nullable=False,
    ),
    Column("name", String(256), nullable=False),
    Column("build_url", String(256), nullable=True), # TODO - add to post from CI
    Column("status", String(256), nullable=True),
    Column("tags", JSONB, nullable=False),
    Index("build_index", "project_id", "build_id"),
    Index("build_tags_index", "tags", postgresql_using="gin"),
)

jobs_table = Table(
    "jobs",
    metadata,
    Column("job_id", Integer, nullable=False, primary_key=True), # CI_CONCURRENT_PROJECT_ID
    Column(
        "build_id",
        ForeignKey(builds_table.c.build_id, ondelete="CASCADE"),
        nullable=False,
    ),
    Column("name", String(256), nullable=False),
    Column("build_url", String(256), nullable=True),
    Column("status", String(256), nullable=True),
    Column("tags", JSONB, nullable=False),
    Index("build_index", "build_id", "job_id"),
    Index("build_tags_index", "tags", postgresql_using="gin"),
)

results_table = Table(
    "results",
    metadata,
    Column("id", Integer, nullable=False, primary_key=True, autoincrement=True),
    Column(
        "job_id", ForeignKey(jobs_table.c.job_id, ondelete="CASCADE"), nullable=False
    ),
    Column("test_name", String(256), nullable=False),
    Column("timestamp", Integer, nullable=False),
    Column("result", String(256), nullable=False),
    Column("result_message", Text, nullable=True),
    Column("tags", JSONB, nullable=False),
    Index("result_index", "project_id", "build_id", "result"),
    Index("result_tags_index", "tags", postgresql_using="gin"),
)


def db_connect(database_dict):
    engine = create_engine(URL(**database_dict))
    metadata.create_all(engine)
    return engine
