-- PostgreSQL DDL for Lab — AI Adoption Platform (B2B)
-- Part of the Sevenpreneur ecosystem
-- Stakeholder hierarchy: Sponsor → Champion → Student
-- All tables prefixed lab_

------------------
-- Enumerations --
------------------

CREATE TYPE lab_stakeholder_enum AS ENUM (
  'student',
  'champion',
  'sponsor'
);

CREATE TYPE lab_use_case_status AS ENUM (
  'draft',
  'submitted',
  'reviewed',
  'approved'
);

CREATE TYPE lab_competency_area AS ENUM (
  'prompt_engineering',
  'workflow_automation',
  'data_analysis',
  'content_creation',
  'ai_strategy',
  'code_generation'
);

------------
-- Tables --
------------

-- Enterprise client companies enrolled in the Lab program

CREATE TABLE lab_companies (
    id         SERIAL      PRIMARY KEY,
    name       VARCHAR     NOT NULL,
    slug       VARCHAR     NOT NULL UNIQUE,
    industry   VARCHAR,
    logo_url   VARCHAR,
    status     status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- All Lab participants: students, champions, and sponsors
-- One user_id per company (enforced by UNIQUE on user_id)

CREATE TABLE lab_members (
    id               SERIAL               PRIMARY KEY,
    user_id          UUID                 NOT NULL UNIQUE,
    company_id       INTEGER              NOT NULL,
    stakeholder_type lab_stakeholder_enum NOT NULL DEFAULT 'student',
    department       VARCHAR,
    job_title        VARCHAR,
    created_at       TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);

-- Department/team groupings within a company
-- champion_id: UNIQUE — each champion leads exactly one team

CREATE TABLE lab_teams (
    id          SERIAL      PRIMARY KEY,
    company_id  INTEGER     NOT NULL,
    name        VARCHAR     NOT NULL,
    department  VARCHAR,
    champion_id INTEGER     NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assigns students to teams
-- member_id: UNIQUE — each student belongs to exactly one team

CREATE TABLE lab_team_members (
    team_id   INTEGER     NOT NULL,
    member_id INTEGER     NOT NULL UNIQUE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (team_id, member_id)
);

-- AI use cases documented by students
-- time_saved_hours: estimated hours saved per week
-- impact_rating: 1–5 self-assessed
-- reviewed_by: champion member_id who reviewed this use case

CREATE TABLE lab_use_cases (
    id               SERIAL                NOT NULL,
    member_id        INTEGER               NOT NULL,
    title            VARCHAR               NOT NULL,
    description      TEXT,
    competency_area  lab_competency_area   NOT NULL,
    tools_used       VARCHAR,
    time_saved_hours SMALLINT,
    impact_rating    SMALLINT CHECK (impact_rating BETWEEN 1 AND 5),
    status           lab_use_case_status   NOT NULL DEFAULT 'draft',
    reviewed_by      INTEGER,
    reviewed_at      TIMESTAMPTZ,
    champion_note    TEXT,
    created_at       TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- AI competency scores per student per area, assessed by champion
-- score: 0–100
-- UNIQUE (member_id, competency_area): one score per area per student

CREATE TABLE lab_competency_scores (
    id              SERIAL              PRIMARY KEY,
    member_id       INTEGER             NOT NULL,
    assessed_by     INTEGER             NOT NULL,
    competency_area lab_competency_area NOT NULL,
    score           SMALLINT            NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
    note            TEXT,
    assessed_at     TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    UNIQUE (member_id, competency_area)
);

-- Asynchronous coaching notes from champion to student
-- is_read: student has seen the note

CREATE TABLE lab_coaching_notes (
    id          SERIAL      PRIMARY KEY,
    champion_id INTEGER     NOT NULL,
    student_id  INTEGER     NOT NULL,
    note        TEXT        NOT NULL,
    is_read     BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scheduled 1:1 coaching sessions between champion and student

CREATE TABLE lab_coaching_sessions (
    id           SERIAL      PRIMARY KEY,
    champion_id  INTEGER     NOT NULL,
    student_id   INTEGER     NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_min SMALLINT    NOT NULL DEFAULT 30,
    meeting_url  VARCHAR,
    agenda       TEXT,
    summary      TEXT,
    completed    BOOLEAN     NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adoption blockers / obstacles reported by students
-- resolved_by: champion member_id who resolved it

CREATE TABLE lab_obstacles (
    id          SERIAL      PRIMARY KEY,
    member_id   INTEGER     NOT NULL,
    title       VARCHAR     NOT NULL,
    description TEXT,
    resolved    BOOLEAN     NOT NULL DEFAULT false,
    resolved_by INTEGER,
    resolved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achievement badges earned by students
-- badge_key: semantic key e.g. 'first_use_case', 'streak_7', 'top_scorer'

CREATE TABLE lab_achievements (
    id        SERIAL      PRIMARY KEY,
    member_id INTEGER     NOT NULL,
    badge_key VARCHAR     NOT NULL,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kudos / appreciations sent between any members

CREATE TABLE lab_appreciations (
    id         SERIAL      PRIMARY KEY,
    from_id    INTEGER     NOT NULL,
    to_id      INTEGER     NOT NULL,
    message    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------
-- References --
----------------

-- Lab member linkage

ALTER TABLE lab_members
  ADD FOREIGN KEY (user_id)    REFERENCES users (id),
  ADD FOREIGN KEY (company_id) REFERENCES lab_companies (id);

-- Team structure

ALTER TABLE lab_teams
  ADD FOREIGN KEY (company_id)  REFERENCES lab_companies (id),
  ADD FOREIGN KEY (champion_id) REFERENCES lab_members (id);

ALTER TABLE lab_team_members
  ADD FOREIGN KEY (team_id)   REFERENCES lab_teams (id) ON DELETE CASCADE,
  ADD FOREIGN KEY (member_id) REFERENCES lab_members (id) ON DELETE CASCADE;

-- Use cases

ALTER TABLE lab_use_cases
  ADD FOREIGN KEY (member_id)   REFERENCES lab_members (id) ON DELETE CASCADE,
  ADD FOREIGN KEY (reviewed_by) REFERENCES lab_members (id) ON DELETE SET NULL;

-- Competency

ALTER TABLE lab_competency_scores
  ADD FOREIGN KEY (member_id)   REFERENCES lab_members (id) ON DELETE CASCADE,
  ADD FOREIGN KEY (assessed_by) REFERENCES lab_members (id) ON DELETE CASCADE;

-- Coaching

ALTER TABLE lab_coaching_notes
  ADD FOREIGN KEY (champion_id) REFERENCES lab_members (id) ON DELETE CASCADE,
  ADD FOREIGN KEY (student_id)  REFERENCES lab_members (id) ON DELETE CASCADE;

ALTER TABLE lab_coaching_sessions
  ADD FOREIGN KEY (champion_id) REFERENCES lab_members (id) ON DELETE CASCADE,
  ADD FOREIGN KEY (student_id)  REFERENCES lab_members (id) ON DELETE CASCADE;

-- Obstacles

ALTER TABLE lab_obstacles
  ADD FOREIGN KEY (member_id)   REFERENCES lab_members (id) ON DELETE CASCADE,
  ADD FOREIGN KEY (resolved_by) REFERENCES lab_members (id) ON DELETE SET NULL;

-- Achievements & appreciations

ALTER TABLE lab_achievements
  ADD FOREIGN KEY (member_id) REFERENCES lab_members (id) ON DELETE CASCADE;

ALTER TABLE lab_appreciations
  ADD FOREIGN KEY (from_id) REFERENCES lab_members (id) ON DELETE CASCADE,
  ADD FOREIGN KEY (to_id)   REFERENCES lab_members (id) ON DELETE CASCADE;
