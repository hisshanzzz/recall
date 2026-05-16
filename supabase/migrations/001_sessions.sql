-- Recall: sessions and transcript storage (demo patient Sunil)

create table patients (
  id text primary key,
  profile jsonb not null
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null references patients (id) on delete cascade,
  room_name text not null unique,
  status text not null check (status in ('active', 'completed', 'failed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds int,
  summary text,
  mood text,
  topic text
);

create table transcript_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  speaker text not null check (speaker in ('agent', 'user')),
  text text not null,
  position int not null,
  created_at timestamptz not null default now(),
  unique (session_id, position)
);

create index sessions_patient_started_at_idx
  on sessions (patient_id, started_at desc);

create index transcript_messages_session_position_idx
  on transcript_messages (session_id, position);

alter table patients enable row level security;
alter table sessions enable row level security;
alter table transcript_messages enable row level security;

insert into patients (id, profile)
values (
  'sunil-001',
  '{
    "name": "Sunil Perera",
    "nick": "Thatha",
    "age": 74,
    "location": "Colombo 7",
    "condition": "Dementia (moderate)",
    "language": "sinhala",
    "memories": [
      "Loved fishing at Negombo lagoon every Sunday for 40 years",
      "Favourite food: pol sambol with rice and dhal curry",
      "Buddhist — visits Kelaniya Raja Maha Viharaya every Poya day",
      "Maths teacher at Nalanda College for 30 years — very proud of this",
      "Loves Amaradeva songs, especially Sanda Eliye",
      "Has a small dog named Sitha who sleeps at his feet",
      "Proudest moment: watching Sri Lanka win the 1996 World Cup"
    ],
    "family": [
      {
        "name": "Pradeep Perera",
        "relation": "Son",
        "location": "Melbourne",
        "whatsapp": "+94771234567",
        "alerts": true
      },
      {
        "name": "Nimali Perera",
        "relation": "Daughter",
        "location": "Kandy",
        "whatsapp": "+94771234568",
        "alerts": false
      }
    ]
  }'::jsonb
);
