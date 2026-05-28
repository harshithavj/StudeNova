create extension if not exists "uuid-ossp";

create table if not exists users (
  id bigserial primary key,
  supabase_auth_id uuid unique,
  full_name varchar(120),
  name varchar(120) not null,
  email varchar(255) unique not null,
  phone varchar(40),
  password_hash varchar(255) not null,
  role varchar(40) not null check (role in ('student', 'college_admin', 'industry_organizer')),
  college_name varchar(180),
  company_name varchar(180),
  department varchar(120),
  designation varchar(120),
  profile_image text,
  college varchar(180),
  company varchar(180),
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists organizers (
  id bigserial primary key,
  name varchar(180) not null,
  type varchar(40) not null check (type in ('college', 'industry', 'club')),
  website text,
  logo_url text,
  verified boolean not null default false,
  owner_id bigint not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id bigserial primary key,
  title varchar(180) not null,
  slug varchar(220) unique not null,
  description text not null,
  category varchar(80) not null,
  mode varchar(20) not null check (mode in ('online', 'offline', 'hybrid')),
  location varchar(180) not null,
  college_name varchar(180),
  company_name varchar(180),
  event_banner text,
  event_date timestamptz,
  college varchar(180),
  eligibility text,
  seats_available integer not null default 0,
  registration_link text,
  poster_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  registration_deadline timestamptz not null,
  status varchar(30) not null default 'published',
  popularity_score numeric not null default 0,
  creator_id bigint not null references users(id) on delete cascade,
  organizer_id bigint references organizers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tags (
  id bigserial primary key,
  name varchar(60) unique not null
);

create table if not exists event_tags (
  event_id bigint not null references events(id) on delete cascade,
  tag_id bigint not null references tags(id) on delete cascade,
  primary key (event_id, tag_id)
);

create table if not exists registrations (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  event_id bigint not null references events(id) on delete cascade,
  status varchar(30) not null default 'registered',
  qr_token varchar(120) unique not null,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists notifications (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  event_id bigint references events(id) on delete cascade,
  channel varchar(40) not null default 'in_app',
  title varchar(180) not null,
  message text,
  body text not null,
  stage varchar(60) not null default 'general',
  is_read boolean not null default false,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists bookmarks (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  event_id bigint not null references events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists analytics (
  id bigserial primary key,
  event_id bigint not null references events(id) on delete cascade,
  metric varchar(80) not null,
  value numeric not null default 0,
  dimension varchar(120),
  recorded_at timestamptz not null default now()
);

create index if not exists idx_events_title on events using gin (to_tsvector('english', title || ' ' || description));
create index if not exists idx_events_category on events(category);
create index if not exists idx_events_deadline on events(registration_deadline);
create index if not exists idx_events_college on events(college);
create index if not exists idx_registrations_event on registrations(event_id);
create index if not exists idx_notifications_user_unread on notifications(user_id, is_read);

insert into storage.buckets (id, name, public)
values ('event-posters', 'event-posters', true)
on conflict (id) do nothing;
