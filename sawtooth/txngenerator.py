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


# Secret keys
# WARNING! These defaults are insecure, and should be changed for deployment
SECRET_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'  # any string
AES_KEY = 'ffffffffffffffffffffffffffffffff'  # 32 character hex string
BATCHER_PRIVATE_KEY = '1111111111111111111111111111111111111111111111111111111111111111'  # 64 character hex string

def create_account(name, description):
    """Create a CreateAccount txn and wrap it in a batch and list.
    Args:
        label (str): The account's label.
        description (str): The description of the account.
    Returns:
        tuple: List of Batch, signature tuple
    """

    #txn_key (sawtooth_signing.Signer): The Txn signer key pair.
    context = create_context('secp256k1')
    private_key = context.new_random_private_key()
    signer = CryptoFactory(context).new_signer(private_key)

    batcher_private_key = Secp256k1PrivateKey.from_hex(BATCHER_PRIVATE_KEY)
    #batch_key (sawtooth_signing.Signer): The Batch signer key pair.
    batcher_signer = CryptoFactory(context).new_signer(batcher_private_key)

    public_key = signer.get_public_key().as_hex()

    ##he inputs and outputs are the state addresses a Transaction is allowed to read from or write to. 
    inputs = [addresser.make_account_address(account_id=public_key)]

    outputs = [addresser.make_account_address(account_id=public_key)]

    account = payload_pb2.CreateAccount(
        label=name,
        description=description)
    payload = payload_pb2.TransactionPayload(
        payload_type=payload_pb2.TransactionPayload.CREATE_ACCOUNT,
        create_account=account)

    return make_header_and_batch(
        payload=payload,
        inputs=inputs,
        outputs=outputs,
        txn_key=signer,
        batch_key=batcher_signer)

def create_asset(name, description, rules):
    """Create a CreateAsset txn and wrap it in a batch and list.
    Args:
        txn_key (sawtooth_signing.Signer): The txn signer key pair.
        batch_key (sawtooth_signing.Signer): The batch signer key pair.
        name (str): The name of the asset.
        description (str): A description of the asset.
        rules (list): List of protobuf.rule_pb2.Rule
    Returns:
        tuple: List of Batch, signature tuple
    """
    
    context = create_context('secp256k1')
    private_key = context.new_random_private_key()
    signer = CryptoFactory(context).new_signer(private_key)

    batcher_private_key = Secp256k1PrivateKey.from_hex(BATCHER_PRIVATE_KEY)
    batcher_signer = CryptoFactory(context).new_signer(batcher_private_key)

    public_key = signer.get_public_key().as_hex()

    inputs = [addresser.make_asset_address(asset_id=name),
              addresser.make_account_address(account_id=public_key)]

    outputs = [addresser.make_asset_address(asset_id=name)]

    asset = payload_pb2.CreateAsset(
        name=name,
        description=description,
        rules=rules
    )

    payload = payload_pb2.TransactionPayload(
        payload_type=payload_pb2.TransactionPayload.CREATE_ASSET,
        create_asset=asset)

    batches, batch_id = make_header_and_batch(
        payload=payload,
        inputs=inputs,
        outputs=outputs,
        txn_key=signer,
        batch_key=batcher_signer)



