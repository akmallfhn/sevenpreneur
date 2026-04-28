-- PostgreSQL DDL for Ailene — AI Learning Platform
-- Part of the Sevenpreneur ecosystem
-- Tables: ai_learn_members, ai_learn_journeys, ai_learn_lessons, ai_learn_quiz_questions, ai_learn_quiz_options,
--         ai_learn_user_progress, ai_learn_sessions, ai_learn_session_attendances

------------------
-- Enumerations --
------------------

CREATE TYPE ai_learn_lesson_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE ai_learn_role_enum AS ENUM (
  'marketing',
  'operational',
  'ceo',
  'finance',
  'hr'
);

------------
-- Tables --
------------

-- Records which users have access to ailene.sevenpreneur.com and their organizational role

CREATE TABLE ai_learn_members (
    id         SERIAL              PRIMARY KEY,
    user_id    UUID                NOT NULL UNIQUE,
    role_name  ai_learn_role_enum  NOT NULL,
    created_at TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

ALTER TABLE ai_learn_members
    ADD CONSTRAINT ai_learn_members_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id);

-- Groups lessons into learning journeys
-- role: optional — if set, journey is targeted to a specific member role; null = all roles

CREATE TABLE ai_learn_journeys (
    id          SERIAL             PRIMARY KEY,
    name        VARCHAR            NOT NULL,
    slug        VARCHAR            NOT NULL UNIQUE,
    description TEXT,
    cover_image VARCHAR,
    role        ai_learn_role_enum,
    order_index SMALLINT           NOT NULL DEFAULT 0,
    status      status_enum        NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- Stores AI learning lessons/articles
-- level: 1 = Foundations, 2 = Techniques, 3 = Advanced, 4 = Strategic
-- journey_id: required — every lesson must belong to a journey

CREATE TABLE ai_learn_lessons (
    id          SERIAL                 PRIMARY KEY,
    title       VARCHAR                NOT NULL,
    slug        VARCHAR                UNIQUE NOT NULL,
    description TEXT,
    content     TEXT                   NOT NULL DEFAULT '',
    youtube_url TEXT                   NOT NULL DEFAULT '',
    level       SMALLINT               NOT NULL DEFAULT 1,
    xp_reward   SMALLINT               NOT NULL DEFAULT 10,
    status      ai_learn_lesson_status NOT NULL DEFAULT 'draft',
    order_index SMALLINT               NOT NULL DEFAULT 0,
    journey_id  INTEGER                NOT NULL,
    created_at  TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

ALTER TABLE ai_learn_lessons
    ADD CONSTRAINT ai_learn_lessons_journey_id_fkey
    FOREIGN KEY (journey_id) REFERENCES ai_learn_journeys(id);

-- Stores multiple-choice quiz questions per lesson

CREATE TABLE ai_learn_quiz_questions (
    id          SERIAL      PRIMARY KEY,
    lesson_id   INTEGER     NOT NULL,
    question    TEXT        NOT NULL,
    explanation TEXT,
    order_index SMALLINT    NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ai_learn_quiz_questions
    ADD CONSTRAINT ai_learn_quiz_questions_lesson_id_fkey
    FOREIGN KEY (lesson_id) REFERENCES ai_learn_lessons(id) ON DELETE CASCADE;

-- Stores individual answer options per quiz question
-- option_id: lowercase letter key ("a", "b", "c", "d")
-- is_correct: only one option per question should be true

CREATE TABLE ai_learn_quiz_options (
    id          SERIAL      PRIMARY KEY,
    question_id INTEGER     NOT NULL,
    option_id   VARCHAR     NOT NULL,
    text        VARCHAR     NOT NULL,
    is_correct  BOOLEAN     NOT NULL DEFAULT false,
    order_index SMALLINT    NOT NULL DEFAULT 0
);

ALTER TABLE ai_learn_quiz_options
    ADD CONSTRAINT ai_learn_quiz_options_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES ai_learn_quiz_questions(id) ON DELETE CASCADE;

-- Tracks progress per member per lesson
-- score: percentage (0–100), null if never attempted
-- xp_earned: only awarded on first pass (score >= 70)
-- completed_at: set when member first passes the quiz
-- answers: submitted quiz answers as JSON { "question_id": "option_id" }

CREATE TABLE ai_learn_user_progress (
    id           SERIAL      PRIMARY KEY,
    member_id    INTEGER     NOT NULL,
    lesson_id    INTEGER     NOT NULL,
    score        SMALLINT,
    xp_earned    SMALLINT    NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    answers      JSON,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (member_id, lesson_id)
);

ALTER TABLE ai_learn_user_progress
    ADD CONSTRAINT ai_learn_user_progress_member_id_fkey
    FOREIGN KEY (member_id) REFERENCES ai_learn_members(id) ON DELETE CASCADE;

ALTER TABLE ai_learn_user_progress
    ADD CONSTRAINT ai_learn_user_progress_lesson_id_fkey
    FOREIGN KEY (lesson_id) REFERENCES ai_learn_lessons(id) ON DELETE CASCADE;

-- Stores live learning sessions (workshops, webinars, etc.) for Ailene members
-- Same architecture as the Learning model in the main platform

CREATE TABLE ai_learn_sessions (
    id                SERIAL               PRIMARY KEY,
    name              VARCHAR              NOT NULL,
    description       VARCHAR              NOT NULL,
    method            learning_method_enum NOT NULL,
    meeting_date      TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
    meeting_url       VARCHAR,
    location_name     VARCHAR,
    location_url      VARCHAR,
    speaker_id        UUID,
    recording_url     VARCHAR,
    external_video_id VARCHAR,
    status            status_enum          NOT NULL DEFAULT 'active',
    check_in          BOOLEAN              NOT NULL DEFAULT false,
    check_out         BOOLEAN              NOT NULL DEFAULT false,
    check_out_code    VARCHAR,
    feedback_form     VARCHAR,
    created_at        TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);

ALTER TABLE ai_learn_sessions
    ADD CONSTRAINT ai_learn_sessions_speaker_id_fkey
    FOREIGN KEY (speaker_id) REFERENCES users(id) ON DELETE SET NULL;

-- Tracks attendance per member per session
-- Composite PK: (session_id, member_id)

CREATE TABLE ai_learn_session_attendances (
    session_id   INTEGER     NOT NULL,
    member_id    INTEGER     NOT NULL,
    check_in_at  TIMESTAMPTZ,
    check_out_at TIMESTAMPTZ,
    PRIMARY KEY (session_id, member_id)
);

ALTER TABLE ai_learn_session_attendances
    ADD CONSTRAINT ai_learn_session_attendances_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES ai_learn_sessions(id) ON DELETE CASCADE;

ALTER TABLE ai_learn_session_attendances
    ADD CONSTRAINT ai_learn_session_attendances_member_id_fkey
    FOREIGN KEY (member_id) REFERENCES ai_learn_members(id) ON DELETE CASCADE;
