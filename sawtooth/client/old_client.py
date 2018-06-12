from sawtooth_signing import create_context
from sawtooth_signing import CryptoFactory

context = create_context('secp256k1')
private_key = context.new_random_private_key()
print (private_key)
signer = CryptoFactory(context).new_signer(private_key)

import cbor

payload = {
    'Verb': 'inc',
    'Name': 'foo',
    'Value': 49}

payload_bytes = cbor.dumps(payload)

####Create the Transaction Header
from hashlib import sha512
from sawtooth_sdk.protobuf.transaction_pb2 import TransactionHeader

##PREM: changed family_name from 'intkey' to 'assettracker'
txn_header_bytes = TransactionHeader(
    family_name='assettracker',
    family_version='1.0',
    inputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    outputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    signer_public_key=signer.get_public_key().as_hex(),
    # In this example, we're signing the batch with the same private key,
    # but the batch can be signed by another party, in which case, the
    # public key will need to be associated with that key.
    batcher_public_key=signer.get_public_key().as_hex(),
    # In this example, there are no dependencies.  This list should include
    # an previous transaction header signatures that must be applied for
    # this transaction to successfully commit.
    # For example,
    # dependencies=['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
    dependencies=[],
    payload_sha512=sha512(payload_bytes).hexdigest()
).SerializeToString()


####Create the Transaction
from sawtooth_sdk.protobuf.transaction_pb2 import Transaction

signature = signer.sign(txn_header_bytes)

txn = Transaction(
    header=txn_header_bytes,
    header_signature=signature,
    payload=payload_bytes
)

####Create the BatchHeader
from sawtooth_sdk.protobuf.batch_pb2 import BatchHeader

txns = [txn]

batch_header_bytes = BatchHeader(
    signer_public_key=signer.get_public_key().as_hex(),
    transaction_ids=[txn.header_signature for txn in txns],
).SerializeToString()

####Create the Batch
from sawtooth_sdk.protobuf.batch_pb2 import Batch

signature = signer.sign(batch_header_bytes)

batch = Batch(
    header=batch_header_bytes,
    header_signature=signature,
    transactions=txns
)

####Encode the Batch(es) in a BatchList
from sawtooth_sdk.protobuf.batch_pb2 import BatchList

batch_list_bytes = BatchList(batches=[batch]).SerializeToString()

####Submitting Batches to the Validator
import urllib.request
from urllib.error import HTTPError

try:
    request = urllib.request.Request(
        #'http://localhost:8008/batches',
        'http://localhost:8043/batches',
        batch_list_bytes,
        method='POST',
        headers={'Content-Type': 'application/octet-stream'})
    response = urllib.request.urlopen(request)

except HTTPError as e:
    response = e.file

####If using Curl
####output = open('intkey.batches', 'wb')
####output.write(batch_list_bytes)
####> curl --request POST \
####    --header "Content-Type: application/octet-stream" \
####    --data-binary @intkey.batches \
####    "http://rest.api.domain/batches"


