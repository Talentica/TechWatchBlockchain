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
import sys
import os

sys.path.append(os.path.dirname(sys.path[0]))

from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.handler import TransactionHandler

import addresshandler

#from marketplace_processor.account import account_creation
#from marketplace_processor.asset import asset_creation
#from marketplace_processor.holding import holding_creation
#from marketplace_processor.offer import offer_acceptance
#from marketplace_processor.offer import offer_closure
#from marketplace_processor.offer import offer_creation
#from marketplace_processor.marketplace_payload import MarketplacePayload
#from marketplace_processor.marketplace_state import MarketplaceState


class AssetHandler(TransactionHandler):

    @property
    def family_name(self):
        return addresshandler.FAMILY_NAME

    @property
    def namespaces(self):
        return [addresshandler.NS]

    @property
    def family_versions(self):
        return ['1.0']

    def apply(self, transaction, context):

        state = AssetState(context=context, timeout=2)
        payload = AssetPayload(payload=transaction.payload)

        if payload.is_create_account():
            if state.get_account(public_key=transaction.header.signer_public_key):
                raise InvalidTransaction("Account with public key {} already "
                "exists".format(transaction.header.signer_public_key))

            newaccount = payload.create_account()
            state.set_account(
                public_key=transaction.header.signer_public_key,
                name=newaccount.name,
                description=newaccount.description,
                approver_level=newaccount.approver_level)
            #account_creation.handle_account_creation(
            #    payload.create_account(),
            #    header=transaction.header,
            #    state=state)
            print("Account created successfully")
        elif payload.is_create_asset():
            if not state.get_account(public_key=transaction.header.signer_public_key):
                raise InvalidTransaction(
                    "Unable to create asset, signing key has no"
                    " Account: {}".format(transaction.header.signer_public_key))

            newasset=payload.create_asset()
            if state.get_asset(name=newasset.name):
                raise InvalidTransaction(
                    "Asset already exists with Name {}".format(newasset.name))

            state.set_asset(
                name=newasset.name,
                description=newasset.description,
                num_steps=newasset.num_steps,
                rules=newasset.rules)

            #asset_creation.handle_asset_creation(
            #    payload.create_asset(),
            #    header=transaction.header,
            #    state=state)
            print("Asset created successfully")
            
        elif payload.is_approve_asset():
            approver = state.get_account(public_key=transaction.header.signer_public_key)
            if not approver:
                raise InvalidTransaction(
                    "Unable to approve asset, signing key has no"
                    " Account: {}".format(transaction.header.signer_public_key))

            approve_asset=payload.approve_asset()
            asset=state.get_asset(approve_asset.name)
            if not asset:
                raise InvalidTransaction(
                    "Failed to approve asset, the asset {} "
                    "does not reference an Asset.".format(
                    approve_asset.name))
            if not asset.curr_step <= approver.approver_level:
                raise InvalidTransaction(
                    "Failed to approve asset, the Asset {} needs approver at level "
                    "higher than {}".format(asset.name, approver.approver_level))

            state.approve_asset(
                name=newasset.name,
                approver_level=approver.approver_level)

            #offer_acceptance.handle_accept_offer(
            #    payload.accept_offer(),
            #    header=transaction.header,
            #    state=state)
        elif payload.is_close_asset():
            close_asset=payload.close_asset()
            asset = state.get_asset(close_asset.name)
            if not asset:
                raise InvalidTransaction(
                    "Failed to close asset, the asset {} "
                    "does not reference an Asset.".format(
                    close_asset.name))
            if asset.curr_step <= asset.num_steps:
                raise InvalidTransaction(
                    "Failed to close asset, the Asset {} is at {} "
                    "not approved at all levels".format(asset.name, asset.curr_step))

            state.close_asset(close_asset.name)
            #offer_closure.handle_close_offer(
            #    payload.close_offer(),
            #    header=transaction.header,
            #    state=state)

        else:
            raise InvalidTransaction("Transaction payload type unknown.")
