-- PostgreSQL DDL for Ailene — AI Learning Platform
-- Part of the Sevenpreneur ecosystem
-- Tables: ai_learn_lessons, ai_learn_quiz_questions, ai_learn_user_progress

------------------
-- Enumerations --
------------------

CREATE TYPE ai_learn_lesson_status AS ENUM (
  'draft',
  'published',
  'archived'
);

------------
-- Tables --
------------

-- Stores AI learning lessons/articles
-- level: 1 = Foundations, 2 = Techniques, 3 = Advanced, 4 = Strategic

CREATE TABLE ai_learn_lessons (
    id          SERIAL          PRIMARY KEY,
    title       VARCHAR         NOT NULL,
    slug        VARCHAR         UNIQUE NOT NULL,
    description TEXT,
    content     TEXT            NOT NULL DEFAULT '',
    level       SMALLINT        NOT NULL DEFAULT 1,
    xp_reward   SMALLINT        NOT NULL DEFAULT 10,
    status      ai_learn_lesson_status NOT NULL DEFAULT 'draft',
    order_index SMALLINT        NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Stores multiple-choice quiz questions per lesson
-- options: JSON array of { id: string, text: string }
-- correct_option: references one of the option ids

CREATE TABLE ai_learn_quiz_questions (
    id             SERIAL      PRIMARY KEY,
    lesson_id      INTEGER     NOT NULL REFERENCES ai_learn_lessons(id) ON DELETE CASCADE,
    question       TEXT        NOT NULL,
    options        JSON        NOT NULL DEFAULT '[]',
    correct_option VARCHAR     NOT NULL,
    explanation    TEXT,
    order_index    SMALLINT    NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tracks each user's progress per lesson
-- score: percentage (0–100), null if never attempted
-- xp_earned: only awarded on first pass (score >= 70)
-- completed_at: set when user first passes the quiz

CREATE TABLE ai_learn_user_progress (
    user_id         UUID        NOT NULL REFERENCES users(id),
    lesson_id       INTEGER     NOT NULL REFERENCES ai_learn_lessons(id) ON DELETE CASCADE,
    completed_at    TIMESTAMPTZ,
    score           SMALLINT,
    xp_earned       SMALLINT    NOT NULL DEFAULT 0,
    attempts        SMALLINT    NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, lesson_id)
);
