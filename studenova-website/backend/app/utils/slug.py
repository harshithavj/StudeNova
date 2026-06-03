import re
from uuid import uuid4


def slugify(value):
    normalized = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return f"{normalized}-{uuid4().hex[:8]}"
