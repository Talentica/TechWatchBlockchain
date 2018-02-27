#!/usr/bin/env python3
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# -----------------------------------------------------------------------------

from models import payload_pb2

class AssetPayload(object):
    
    def __init__(self, payload):
        self._transaction = payload_pb2.TransactionPayload()
        self._transaction.ParseFromString(payload)

    def create_account(self):
        """Returns the value set in the create_account.

        Returns:
            payload_pb2.CreateAccount
        """

        return self._transaction.create_account

    def is_create_account(self):

        create_account = payload_pb2.TransactionPayload.CREATE_ACCOUNT

        return self._transaction.payload_type == create_account

    def create_asset(self):
        """Returns the value set in the create_asset.

        Returns:
            payload_pb2.CreateAsset
        """

        return self._transaction.create_asset

    def is_create_asset(self):

        create_asset = payload_pb2.TransactionPayload.CREATE_ASSET

        return self._transaction.payload_type == create_asset

    def approve_asset(self):
        """Returns the value set in approve_asset.
        Returns:
            payload_pb2.ApproveAsset
        """

        return self._transaction.approve_asset

    def is_approve_asset(self):

        approve_asset = payload_pb2.TransactionPayload.APPROVE_ASSET

        return self._transaction.payload_type == approve_asset

    def close_asset(self):
        """Returns the value set in accept_offer.
        Returns:
            payload_pb2.CloseAsset
        """

        return self._transaction.close_asset

    def is_close_asset(self):

        close_asset = payload_pb2.TransactionPayload.CLOSE_ASSET

        return self._transaction.payload_type == close_asset

