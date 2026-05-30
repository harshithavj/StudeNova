from flask import current_app
from supabase import create_client


def upload_file(file_storage, path, bucket):
    url = current_app.config.get("SUPABASE_URL")
    key = current_app.config.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("Supabase storage is not configured")
    client = create_client(url, key)
    client.storage.from_(bucket).upload(path, file_storage.read(), {"content-type": file_storage.content_type})
    return client.storage.from_(bucket).get_public_url(path)


def upload_event_poster(file_storage, path):
    bucket = current_app.config.get("SUPABASE_STORAGE_BUCKET")
    return upload_file(file_storage, path, bucket)


def upload_organizer_verification(file_storage, path):
    bucket = current_app.config.get("SUPABASE_VERIFICATION_BUCKET")
    return upload_file(file_storage, path, bucket)
