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

create table if not exists organizer_verification_assets (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  asset_type varchar(80) not null check (asset_type in ('college_id_proof', 'club_details', 'club_membership_proof')),
  file_url text not null,
  file_name varchar(255) not null,
  content_type varchar(120) not null,
  status varchar(30) not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists events (
  id bigserial primary key,
  title varchar(180) not null,
  slug varchar(220) unique not null,
  description text not null,
  category varchar(80) not null,
  domain varchar(120),
  mode varchar(20) not null check (mode in ('online', 'offline', 'hybrid')),
  location varchar(180) not null,
  college_name varchar(180),
  company_name varchar(180),
  conducting_organization varchar(180),
  event_banner text,
  event_date timestamptz,
  college varchar(180),
  eligibility text,
  team_size varchar(40),
  prize_pool numeric(12, 2) not null default 0,
  rules text,
  schedule jsonb not null default '[]'::jsonb,
  contact_email varchar(255),
  faqs jsonb not null default '[]'::jsonb,
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
  external_platform varchar(120),
  external_registration_url text,
  marked_completed_at timestamptz,
  qr_token varchar(120) unique not null,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists student_profiles (
  id bigserial primary key,
  user_id bigint not null unique references users(id) on delete cascade,
  department varchar(160),
  academic_year varchar(60),
  skills jsonb not null default '[]'::jsonb,
  interests jsonb not null default '[]'::jsonb,
  domains jsonb not null default '[]'::jsonb,
  resume_url text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  participation_streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists student_event_reminders (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  event_id bigint not null references events(id) on delete cascade,
  reminder_type varchar(80) not null check (reminder_type in ('deadline_7d', 'deadline_3d', 'deadline_24h', 'deadline_1h', 'event_start', 'submission_deadline', 'waiting_list_conversion')),
  channel varchar(40) not null default 'in_app' check (channel in ('in_app', 'email', 'push')),
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists student_achievements (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  event_id bigint references events(id) on delete set null,
  title varchar(180) not null,
  achievement_type varchar(80) not null default 'participation',
  position varchar(80),
  cash_prize_amount numeric(12, 2),
  certificate_url text,
  proof_url text,
  image_url text,
  is_public boolean not null default true,
  awarded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists student_connections (
  id bigserial primary key,
  requester_id bigint not null references users(id) on delete cascade,
  receiver_id bigint not null references users(id) on delete cascade,
  status varchar(30) not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  unique (requester_id, receiver_id),
  check (requester_id <> receiver_id)
);

create table if not exists student_communities (
  id bigserial primary key,
  name varchar(160) unique not null,
  domain varchar(120) not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists student_community_members (
  community_id bigint not null references student_communities(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  role varchar(40) not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table if not exists event_discussion_posts (
  id bigserial primary key,
  event_id bigint not null references events(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  parent_id bigint references event_discussion_posts(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
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
create index if not exists idx_organizer_verification_assets_user on organizer_verification_assets(user_id);
create index if not exists idx_events_category on events(category);
create index if not exists idx_events_domain on events(domain);
create index if not exists idx_events_deadline on events(registration_deadline);
create index if not exists idx_events_college on events(college);
create index if not exists idx_events_organization on events(conducting_organization);
create index if not exists idx_registrations_event on registrations(event_id);
create index if not exists idx_notifications_user_unread on notifications(user_id, is_read);
create index if not exists idx_student_profiles_domains on student_profiles using gin (domains);
create index if not exists idx_student_reminders_due on student_event_reminders(scheduled_for, sent_at);
create index if not exists idx_student_achievements_user on student_achievements(user_id, awarded_at);
create index if not exists idx_student_connections_lookup on student_connections(requester_id, receiver_id, status);
create index if not exists idx_student_communities_domain on student_communities(domain);
create index if not exists idx_event_discussions_event on event_discussion_posts(event_id, created_at);

insert into storage.buckets (id, name, public)
values ('event-posters', 'event-posters', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('organizer-verifications', 'organizer-verifications', true)
on conflict (id) do nothing;
