# utility lib for generating time-sortable UUIDs, hash comparisons etc.

import string
import random
import hashlib
import time


def hash_string(input: str) -> str:
    encoded_input = input.encode("utf-8")
    hashed_encoding = hashlib.sha512(encoded_input)
    hex_digest = hashed_encoding.hexdigest()
    return hex_digest


def hash_with_salt(input: str, salt: str) -> str:
    salted_input = input + salt
    hex_digest = hash_string(salted_input)
    return hex_digest


def random_string(length: int = 64) -> str:
    symbols = string.ascii_letters + string.digits
    random_symbols = [random.choice(symbols) for i in range(length)]
    result = "".join(symbol for symbol in random_symbols)
    return result


def new_uid() -> str:
    timestamp = time.time()
    timestamp = str(timestamp).replace(".", "")
    result = f"{timestamp}-{random_string(12)}"
    return result
