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
from qaportal.data import sql
from qaportal.data.db_handler import get_handler
from qaportal.data.models.base import BaseModel, truncate


class Pipeline(BaseModel):

    TABLE = sql.pipelines_table

    def __init__(
        self,
        **kwargs,
    ):
        self.id = int(kwargs["pipeline_id"])
        # TODO - do we really need to truncate (?)
        self.name = truncate(kwargs["pipeline_name"], self.TABLE.c.name.type.length)
        self.build_url = truncate(
            kwargs.get("build_url"), self.TABLE.c.build_url.type.length
        )
        self.status = truncate(kwargs.get("status"), self.TABLE.c.status.type.length)
        self.tags = kwargs.get("tags") or {}

    @classmethod
    def create(self, resource, handler=None):
        """

        Create allows duplicates for the pipelines. Simply do nothing in
        this instance.

        """
        data = resource.to_dict()
        from sqlalchemy.dialects.postgresql import insert

        stmt = (
            insert(resource.TABLE)
            .values(**data)
            .on_conflict_do_nothing(index_elements=["id"])
        )
        print(f"PIPELINE: Insert statement: {stmt}")
        handler = handler or get_handler()
        result = handler.engine.execute(stmt)
        resource.id = result.inserted_primary_key[0]
        return resource

    @classmethod
    def get_all(
        cls,
        handler=None,
        limit=None,
        offset=None,
        name=None,
        build_url=None,
        status=None,
        **tag_filters,
    ):
        handler = handler or get_handler()
        and_clause = cls._and_clause(
            name=name,
            build_url=build_url,
        )

        # match the build if its tags are a superset of the filters
        # TODO - re-enable when needed
        # if tag_filters:
        #     and_clause &= cls.TABLE.c.tags.contains(tag_filters)

        query = cls._get_all_query(
            and_clause=and_clause,
            limit=limit,
            offset=offset,
        )
        builds = handler.get_all(resource_class=cls, query=query)

        return builds

    @classmethod
    def delete(cls, resource_id, handler=None):
        handler = handler or get_handler()
        return handler.delete(resource_id=resource_id, resource_class=cls)
