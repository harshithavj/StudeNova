import os
import sys
from pathlib import Path


ADMIN_BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = ADMIN_BACKEND_DIR.parents[1]
STUDENOVA_BACKEND_DIR = PROJECT_ROOT / "studenova-website" / "backend"
STUDENOVA_INSTANCE_DIR = STUDENOVA_BACKEND_DIR / "instance"
DATABASE_FILE = STUDENOVA_INSTANCE_DIR / "studenova.db" if (STUDENOVA_INSTANCE_DIR / "studenova.db").exists() else STUDENOVA_BACKEND_DIR / "studenova.db"

if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = f"sqlite:///{DATABASE_FILE.resolve().as_posix()}"

sys.path.insert(0, str(STUDENOVA_BACKEND_DIR))

from app import create_app  # noqa: E402


app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("ADMIN_API_PORT", "5101"))
    app.run(host="0.0.0.0", port=port, debug=True)
