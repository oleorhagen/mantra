from tests.base import BaseTetraTest


class BasePipelinesTest(BaseTetraTest):
    def setUp(self):
        super(BasePipelinesTest, self).setUp()
        import random
        self.pipeline = {
            "pipeline_id": 1234,
            "name": "nightly-1.1.70",
            "build_url": "gitlab-url",
        }
        self._create_pipeline(**self.pipeline)

    def tearDown(self):
        print('teardown')
        self.client.delete_pipeline(self.pipeline["pipeline_id"])


class TestPipelines(BasePipelinesTest):

    def test_create_pipeline(self):  #
        print("Testing create")
        self.assertEqual(self.pipeline["name"], "nightly-1.1.70")  #
        # self.assertEqual(self.pipeline["build_url"], "test-url")                #
        # self.assertEqual(self.pipeline["region"], "test-region")                #
        # self.assertEqual(self.pipeline["environment"], "test-env")              #
        # self.assertEqual(self.pipeline["status"], "passed")                     #
        # self.assertEqual(self.pipeline["tags"], {})                             #

    #                                                                              #
    # def test_delete_pipeline(self):  #
    #     print("Testing delete")
    #     resp = self.client.delete_pipeline(self.pipeline["pipeline_id"])  #
    #     self.assertEqual(resp.status_code, 204)  #
    #     self.assertEqual(resp.text.strip(), "")  #
