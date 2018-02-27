import enum
import hashlib

FAMILY_NAME = 'assettracker'

NS = hashlib.sha512(FAMILY_NAME.encode()).hexdigest()[:6]

class AssetSpace(enum.IntEnum):
    START = 1
    STOP = 50

class AccountSpace(enum.IntEnum):
    START = 125
    STOP = 200

@enum.unique
class AddressSpace(enum.IntEnum):
    ASSET = 0
    HOLDING = 1
    ACCOUNT = 2
    OFFER = 3
    OFFER_HISTORY = 4

    OTHER_FAMILY = 100


def _hash(identifier):
    return hashlib.sha512(identifier.encode()).hexdigest()


def _compress(address, start, stop):
    return "%.2X".lower() % (int(address, base=16) % (stop - start) + start)


def make_asset_address(asset_id):
    full_hash = _hash(asset_id)

    return NS + _compress(
        full_hash,
        AssetSpace.START,
        AssetSpace.STOP) + full_hash[:62]


def make_account_address(account_id):
    full_hash = _hash(account_id)

    return NS + _compress(
        full_hash,
        AccountSpace.START,
        AccountSpace.STOP) + full_hash[:62]


