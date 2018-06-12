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
import asyncio
import zmq
import zmq.asyncio

#sys.path.append(os.path.dirname(sys.path[0]))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))) )
from txngenerator import init_context_pkey_signer
from txngenerator import create_account
from txngenerator import create_asset
from txngenerator import approve_asset
from txngenerator import close_asset
from models import rule_pb2

from sawtooth_rest_api.messaging import Connection
from sawtooth_rest_api.protobuf import client_batch_submit_pb2
from sawtooth_rest_api.protobuf import validator_pb2

#'http://localhost:8008/batches'
#VALIDATOR_URL = 'tcp://localhost:4004'
VALIDATOR_URL = 'http://localhost:8043/batches'
TIMEOUT = 500
def main():
    #loop = zmq.asyncio.ZMQEventLoop()
    #asyncio.set_event_loop(loop)
    #loop = asyncio.get_event_loop()
    try:
        init_context_pkey_signer()
        #validator_conn = Connection(VALIDATOR_URL)

        batches, batch_id = create_account("SampleAccount", "Sample Description!!", 5)
        batch_request = client_batch_submit_pb2.ClientBatchSubmitRequest()
        batch_request.batches.extend(batches)
        #loop.run_until_complete(validator_conn.send(
        #    validator_pb2.Message.CLIENT_BATCH_SUBMIT_REQUEST,
        #    batch_request.SerializeToString(),
        #    TIMEOUT))
        #loop.run_until_complete(createacctmsg)
        #messaging.send(
        #    validator_conn,
        #    TIMEOUT,
        #    batches)
        send_batch_request(batch_request.SerializeToString())
        #time.sleep(1)

        inp = input("Have you created all the user accounts (y/n): ")
        print(inp)
        
        rule_proto = rule_pb2.Rule(type=rule_pb2.Rule.RULE_UNSET)
        rule_proto.value = bytes([1])
        assetbatches, assetbatch_id = create_asset("SampleAsset", "Sample Asset Desc", 2, [rule_proto])
        asset_batch_request = client_batch_submit_pb2.ClientBatchSubmitRequest()
        asset_batch_request.batches.extend(assetbatches)
        #validator_conn.send(
        #    validator_pb2.Message.CLIENT_BATCH_SUBMIT_REQUEST,
        #    asset_batch_request.SerializeToString(),
        #    TIMEOUT)
        send_batch_request(asset_batch_request.SerializeToString())

        inp = input('Have you created all the assets (y/n): ')
        print(inp)
        
        apprbatches, apprbatch_id = approve_asset("SampleAsset", 1)
        appr_batch_request = client_batch_submit_pb2.ClientBatchSubmitRequest()
        appr_batch_request.batches.extend(apprbatches)
        #validator_conn.send(
        #    validator_pb2.Message.CLIENT_BATCH_SUBMIT_REQUEST,
        #    appr_batch_request.SerializeToString(),
        #    TIMEOUT)
        send_batch_request(appr_batch_request.SerializeToString())
        inp = input('Have you approved all the steps (y/n): ')
        print(inp)

        closebatches, closebatch_id = close_asset("SampleAsset")
        close_batch_request = client_batch_submit_pb2.ClientBatchSubmitRequest()
        close_batch_request.batches.extend(closebatches)
        #validator_conn.send(
        #    validator_pb2.Message.CLIENT_BATCH_SUBMIT_REQUEST,
        #    close_batch_request.SerializeToString(),
        #    TIMEOUT)
        send_batch_request(close_batch_request.SerializeToString())
        print('asset closed successfully.')

    except KeyboardInterrupt:
        print("Keyboard Interruption.")
        sys.exit(0)
    finally:
        print("Client Exited Successfully.")

    #loop.close()

####Submitting Batches to the Validator
def send_batch_request(batch_list_bytes):

    import urllib.request
    from urllib.error import HTTPError
    
    try:
        request = urllib.request.Request(
        #'http://localhost:8008/batches',
            VALIDATOR_URL,
            batch_list_bytes,
            method='POST',
            headers={'Content-Type': 'application/octet-stream'})
        response = urllib.request.urlopen(request)
        print(response.read())
    except HTTPError as e:
        #response = e.file
        print(e.code)
        print(e.read())


