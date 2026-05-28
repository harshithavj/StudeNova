# STUDENOVA REST API

Base URL: `http://localhost:5000/api`

Authentication uses JWT bearer tokens returned by `/auth/signup` and `/auth/login`.

## Auth

`POST /auth/signup`

```json
{
  "name": "Anika Rao",
  "email": "anika@example.com",
  "password": "StrongPass123",
  "role": "student",
  "college": "Global Institute of Technology"
}
```

`POST /auth/login`

```json
{
  "email": "anika@example.com",
  "password": "StrongPass123"
}
```

`GET /auth/me` requires `Authorization: Bearer <token>`.

## Events

`GET /events?q=hackathon&category=Hackathons&college=Global&location=Bengaluru&sort=deadline`

`POST /events` requires `college_admin` or `industry_organizer`.

```json
{
  "title": "NovaHack Inter-College Hackathon",
  "description": "A production-grade student hackathon with mentors and recruiters.",
  "category": "Hackathons",
  "mode": "offline",
  "location": "Bengaluru",
  "college": "Global Institute of Technology",
  "eligibility": "Open to all undergraduate students",
  "seats_available": 180,
  "registration_link": "https://example.com/register",
  "poster_url": "https://example.com/poster.jpg",
  "starts_at": "2026-06-08T09:00:00+05:30",
  "registration_deadline": "2026-06-01T23:59:00+05:30",
  "tags": ["ai", "fintech", "24-hour"]
}
```

Other event endpoints:

- `GET /events/:id`
- `PUT /events/:id`
- `DELETE /events/:id`
- `POST /events/:id/poster` with multipart field `poster`

## Registrations

- `POST /registrations/events/:event_id`
- `GET /registrations/me`
- `GET /registrations/events/:event_id` organizer only
- `POST /registrations/check-in/:qr_token` organizer only

## Bookmarks

- `GET /bookmarks`
- `POST /bookmarks/events/:event_id`
- `DELETE /bookmarks/events/:event_id`

## Notifications

- `GET /notifications`
- `PATCH /notifications/:notification_id/read`

## Analytics

- `GET /analytics/overview` organizer only
- `GET /analytics/event/:event_id` organizer only
- `GET /analytics/recommendations`

## Search

`GET /search?q=cloud`
