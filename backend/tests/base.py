import random
import unittest

from tests.client import TetraClient


class BaseTetraTest(unittest.TestCase):
    def setUp(self):
        # super(BaseTetraTest, self).setUp()
        self.client = TetraClient.get()
