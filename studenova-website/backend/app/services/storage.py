from pathlib import Path

from flask import current_app, url_for
from supabase import create_client


def upload_file(file_storage, path, bucket):
    if not bucket:
        raise RuntimeError("Storage bucket is not configured")

    url = current_app.config.get("SUPABASE_URL")
    key = current_app.config.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        upload_root = current_app.config.get("LOCAL_UPLOAD_ROOT")
        if not upload_root:
            upload_root = str(Path(current_app.instance_path) / "uploads")
        local_path = Path(upload_root) / bucket / path
        local_path.parent.mkdir(parents=True, exist_ok=True)
        file_storage.stream.seek(0)
        file_storage.save(local_path)
        return url_for("uploaded_file", bucket=bucket, filename=path, _external=True)

    client = create_client(url, key)
    file_storage.stream.seek(0)
    client.storage.from_(bucket).upload(path, file_storage.read(), {"content-type": file_storage.content_type})
    return client.storage.from_(bucket).get_public_url(path)


def upload_event_poster(file_storage, path):
    bucket = current_app.config.get("SUPABASE_STORAGE_BUCKET")
    return upload_file(file_storage, path, bucket)


def upload_organizer_verification(file_storage, path):
    bucket = current_app.config.get("SUPABASE_VERIFICATION_BUCKET")
    return upload_file(file_storage, path, bucket)
