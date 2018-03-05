#!/usr/bin/env python3
#
# -----------------------------------------------------------------------------
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
import os
import sys
import time

#sys.path.append(os.path.dirname(sys.path[0]))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))) )
from txngenerator import create_account
from protobuf import rule_pb2

from sawtooth_rest_api.messaging import Connection
from sawtooth_rest_api.protobuf import client_batch_submit_pb2
from sawtooth_rest_api.protobuf import validator_pb2

#'http://localhost:8008/batches'
VALIDATOR_URL = 'tcp://localhost:4004'
TIMEOUT = 500
def main():
    try:
        init_context_pkey_signer()
        validator_conn = Connection(VALIDATOR_URL)

        batches, batch_id = create_account("SampleAccount", "Sample Description!!", 5)
        batch_request = client_batch_submit_pb2.ClientBatchSubmitRequest()
        batch_request.batches.extend(batches)
        validator_conn.send(
            validator_pb2.Message.CLIENT_BATCH_SUBMIT_REQUEST,
            batch_request.SerializeToString(),
            TIMEOUT)
        #messaging.send(
        #    validator_conn,
        #    TIMEOUT,
        #    batches)
        time.sleep(5)

        inp = input('Have you created all the user accounts (y/n): ')
        
        assetbatches, assetbatch_id = create_asset("SampleAsset", "Sample Asset Desc", 2, [RULE_UNSET])
        asset_batch_request = client_batch_submit_pb2.ClientBatchSubmitRequest()
        asset_batch_request.batches.extend(assetbatches)
        validator_conn.send(
            validator_pb2.Message.CLIENT_BATCH_SUBMIT_REQUEST,
            asset_batch_request.SerializeToString(),
            TIMEOUT)

        inp = input('Have you created all the assets (y/n): ')
        
        
    except KeyboardInterrupt:
        print("Keyboard Interruption.")
        sys.exit(0)
    finally:
        print("Client Exited Successfully.")

