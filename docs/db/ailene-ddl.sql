-- PostgreSQL DDL for Ailene — AI Learning Platform
-- Part of the Sevenpreneur ecosystem

------------------
-- Enumerations --
------------------

CREATE TYPE ail_role AS ENUM (
  'student',
  'champion',
  'sponsor'
);

CREATE TYPE ail_use_case_frequency AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'occasionally'
);

CREATE TYPE ail_learning_type AS ENUM (
  'quiz',
  'video',
  'material'
);

-- Pre-assessment single-choice enums (one per question)

CREATE TYPE ail_pa_ai_use_freq AS ENUM (
  'never',
  'tried',
  'weekly',
  'daily',
  'intensive'
);

CREATE TYPE ail_pa_understanding AS ENUM (
  'none',
  'aware',
  'basic',
  'explain',
  'expert'
);

CREATE TYPE ail_pa_output_review AS ENUM (
  'no_check',
  'sometimes',
  'always',
  'cross_check',
  'no_use'
);

CREATE TYPE ail_pa_team_adoption AS ENUM (
  'none',
  'personal',
  'pilot',
  'policy',
  'integrated'
);

CREATE TYPE ail_pa_prompt_skill AS ENUM (
  'none',
  'basic',
  'decent',
  'structured',
  'expert'
);

CREATE TYPE ail_pa_attitude AS ENUM (
  'too_risky',
  'cautious',
  'neutral',
  'supportive',
  'essential'
);

CREATE TYPE ail_pa_motivation AS ENUM (
  'mandatory',
  'curious',
  'tentative',
  'ready',
  'eager'
);

------------
-- Tables --
------------

-- Lookup tables

CREATE TABLE ail_categories (
    id   SMALLSERIAL  PRIMARY KEY,
    name VARCHAR      NOT NULL UNIQUE
);

-- Organizational access related

CREATE TABLE ail_members (
    id               SERIAL              PRIMARY KEY,
    user_id          UUID                NOT NULL UNIQUE,
    role             ail_role            NOT NULL,
    job_title        VARCHAR             NOT NULL,
    group_id         INTEGER                 NULL,
    current_level_id INTEGER             NOT NULL DEFAULT 0,
    level_history    JSON                NOT NULL DEFAULT '[]',
    last_active_at   TIMESTAMPTZ             NULL,
    created_at       TIMESTAMPTZ         NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_groups (
    id          SERIAL       PRIMARY KEY,
    name        VARCHAR      NOT NULL,
    champion_id INTEGER      NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Learning related

CREATE TABLE ail_levels (
    id           SERIAL       PRIMARY KEY,
    level_number SMALLINT     NOT NULL UNIQUE,
    name         VARCHAR      NOT NULL,
    icon         VARCHAR          NULL,
    min_xp       INTEGER      NOT NULL DEFAULT 0,
    status       status_enum  NOT NULL DEFAULT 'active',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_chapters (
    id           SERIAL             PRIMARY KEY,
    level_id     INTEGER            NOT NULL,
    name         VARCHAR            NOT NULL,
    description  TEXT                   NULL,
    session_date TIMESTAMPTZ        NOT NULL,
    status       status_enum        NOT NULL DEFAULT 'active',
    created_at   TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_quizzes (
    id          VARCHAR            PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'hex'),
    chapter_id  INTEGER            NOT NULL,
    name        VARCHAR            NOT NULL,
    description TEXT                   NULL,
    order_index SMALLINT           NOT NULL DEFAULT 0,
    status      status_enum        NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_quiz_questions (
    id          SERIAL      PRIMARY KEY,
    quiz_id     VARCHAR     NOT NULL,
    question    TEXT        NOT NULL,
    explanation TEXT            NULL,
    order_index SMALLINT    NOT NULL DEFAULT 0,
    xp_reward   SMALLINT    NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_quiz_options (
    id          SERIAL      PRIMARY KEY,
    question_id INTEGER     NOT NULL,
    option_code VARCHAR     NOT NULL,
    text        VARCHAR     NOT NULL,
    is_correct  BOOLEAN     NOT NULL DEFAULT false
);

CREATE TABLE ail_videos (
    id          SERIAL             PRIMARY KEY,
    chapter_id  INTEGER            NOT NULL,
    title       VARCHAR            NOT NULL,
    description TEXT                   NULL,
    video_url   TEXT               NOT NULL,
    xp_reward   SMALLINT           NOT NULL DEFAULT 0,
    order_index SMALLINT           NOT NULL DEFAULT 0,
    status      status_enum        NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_materials (
    id          VARCHAR            PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'hex'),
    chapter_id  INTEGER            NOT NULL,
    title       VARCHAR            NOT NULL,
    description TEXT                   NULL,
    content     TEXT                   NULL,
    file_url    TEXT                   NULL,
    xp_reward   SMALLINT           NOT NULL DEFAULT 0,
    order_index SMALLINT           NOT NULL DEFAULT 0,
    status      status_enum        NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (content IS NOT NULL OR file_url IS NOT NULL)
);

CREATE TABLE ail_prompts (
    id              SERIAL       PRIMARY KEY,
    level_id        INTEGER      NOT NULL,
    name            VARCHAR      NOT NULL,
    scenario        TEXT         NOT NULL,
    expected_output TEXT         NOT NULL,
    category_id     SMALLINT     NOT NULL,
    status          status_enum  NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_prompt_submissions (
    id             SERIAL       PRIMARY KEY,
    member_id      INTEGER      NOT NULL,
    prompt_id      INTEGER      NOT NULL,
    assigned_by_id INTEGER          NULL,                        -- champion who assigned; NULL = self-driven
    deadline       TIMESTAMPTZ      NULL,
    message        TEXT             NULL,                        -- champion's assignment note
    input          TEXT             NULL,                        -- filled by student
    output         TEXT             NULL,
    submitted_at   TIMESTAMPTZ      NULL,                        -- NULL = not yet submitted
    reviewed_by_id INTEGER          NULL,                        -- champion who reviewed
    reviewed_at    TIMESTAMPTZ      NULL,
    comment        TEXT             NULL,                        -- champion's review feedback
    is_accepted    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (member_id, prompt_id)
);

CREATE TABLE ail_use_cases (
    id          SERIAL       PRIMARY KEY,
    level_id    INTEGER      NOT NULL,
    name        VARCHAR      NOT NULL,
    category_id SMALLINT     NOT NULL,
    description TEXT         NOT NULL,
    status      status_enum  NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ail_use_case_submissions (
    id             SERIAL                 PRIMARY KEY,
    member_id      INTEGER                NOT NULL,
    use_case_id    INTEGER                NOT NULL,
    assigned_by_id INTEGER                    NULL,
    deadline       TIMESTAMPTZ                NULL,
    message        TEXT                       NULL,
    outcome_proof  VARCHAR                    NULL,
    hours_saved    DECIMAL(6, 2)              NULL,
    description    TEXT                       NULL,
    ai_tool        VARCHAR                    NULL,
    frequency      ail_use_case_frequency     NULL,
    submitted_at   TIMESTAMPTZ                NULL,
    reviewed_by_id INTEGER                    NULL,
    reviewed_at    TIMESTAMPTZ                NULL,
    comment        TEXT                       NULL,
    is_accepted    BOOLEAN                NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (member_id, use_case_id)
);

-- Relation Tables --

CREATE TABLE ail_quiz_submissions (
    id             SERIAL       PRIMARY KEY,
    member_id      INTEGER      NOT NULL,
    quiz_id        VARCHAR      NOT NULL,
    attempt_number SMALLINT     NOT NULL,
    answers        JSON         NOT NULL,
    score          SMALLINT     NOT NULL,
    is_completed   BOOLEAN      NOT NULL DEFAULT FALSE,
    started_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (member_id, quiz_id, attempt_number)
);

CREATE TABLE ail_video_completions (
    member_id    INTEGER      NOT NULL,
    video_id     INTEGER      NOT NULL,
    completed_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id, video_id)
);

CREATE TABLE ail_material_completions (
    member_id    INTEGER      NOT NULL,
    material_id  VARCHAR      NOT NULL,
    completed_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id, material_id)
);

CREATE TABLE ail_xp_earnings (
    id            SERIAL              PRIMARY KEY,
    member_id     INTEGER             NOT NULL,
    learning_type ail_learning_type   NOT NULL,
    learning_id   VARCHAR             NOT NULL,
    xp_earned     SMALLINT            NOT NULL,
    earned_at     TIMESTAMPTZ         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (member_id, learning_type, learning_id)
);

CREATE TABLE ail_pre_assessments (
    id                        SERIAL                 PRIMARY KEY,
    member_id                 INTEGER                NOT NULL UNIQUE,
    q1_ai_use_frequency       ail_pa_ai_use_freq     NOT NULL,
    q2_ai_tools_used          TEXT[]                 NOT NULL DEFAULT '{}',
    q3_job_role               VARCHAR                NOT NULL,
    q4_ai_understanding       ail_pa_understanding   NOT NULL,
    q5_ai_limitations         TEXT[]                 NOT NULL DEFAULT '{}',
    q6_output_review          ail_pa_output_review   NOT NULL,
    q7_use_cases              TEXT[]                 NOT NULL DEFAULT '{}',
    q8_team_adoption          ail_pa_team_adoption   NOT NULL,
    q9_concrete_example       VARCHAR                    NULL,
    q10_prompt_comfort        ail_pa_prompt_skill    NOT NULL,
    q11_safety_practices      TEXT[]                 NOT NULL DEFAULT '{}',
    q12_professional_attitude ail_pa_attitude        NOT NULL,
    q13_biggest_challenge     TEXT                   NOT NULL,
    q14_training_expectation  TEXT                   NOT NULL,
    q15_motivation            ail_pa_motivation      NOT NULL,
    created_at                TIMESTAMPTZ            NOT NULL DEFAULT CURRENT_TIMESTAMP
);

----------------
-- References --
----------------

ALTER TABLE ail_members
  ADD FOREIGN KEY (user_id)          REFERENCES users (id),
  ADD FOREIGN KEY (group_id)         REFERENCES ail_groups (id),
  ADD FOREIGN KEY (current_level_id) REFERENCES ail_levels (id);

ALTER TABLE ail_groups
  ADD FOREIGN KEY (champion_id) REFERENCES ail_members (id);

ALTER TABLE ail_chapters
  ADD FOREIGN KEY (level_id) REFERENCES ail_levels (id);

ALTER TABLE ail_quizzes
  ADD FOREIGN KEY (chapter_id) REFERENCES ail_chapters (id);

ALTER TABLE ail_videos
  ADD FOREIGN KEY (chapter_id) REFERENCES ail_chapters (id);

ALTER TABLE ail_materials
  ADD FOREIGN KEY (chapter_id) REFERENCES ail_chapters (id);

ALTER TABLE ail_quiz_questions
  ADD FOREIGN KEY (quiz_id) REFERENCES ail_quizzes (id);

ALTER TABLE ail_quiz_options
  ADD FOREIGN KEY (question_id) REFERENCES ail_quiz_questions (id);

ALTER TABLE ail_quiz_submissions
  ADD FOREIGN KEY (member_id) REFERENCES ail_members (id),
  ADD FOREIGN KEY (quiz_id)   REFERENCES ail_quizzes (id);

ALTER TABLE ail_video_completions
  ADD FOREIGN KEY (member_id) REFERENCES ail_members (id),
  ADD FOREIGN KEY (video_id)  REFERENCES ail_videos (id);

ALTER TABLE ail_material_completions
  ADD FOREIGN KEY (member_id)   REFERENCES ail_members (id),
  ADD FOREIGN KEY (material_id) REFERENCES ail_materials (id);

ALTER TABLE ail_xp_earnings
  ADD FOREIGN KEY (member_id) REFERENCES ail_members (id);

ALTER TABLE ail_pre_assessments
  ADD FOREIGN KEY (member_id) REFERENCES ail_members (id);

ALTER TABLE ail_prompts
  ADD FOREIGN KEY (level_id)    REFERENCES ail_levels (id),
  ADD FOREIGN KEY (category_id) REFERENCES ail_categories (id);

ALTER TABLE ail_prompt_submissions
  ADD FOREIGN KEY (member_id)      REFERENCES ail_members (id),
  ADD FOREIGN KEY (prompt_id)      REFERENCES ail_prompts (id),
  ADD FOREIGN KEY (assigned_by_id) REFERENCES ail_members (id),
  ADD FOREIGN KEY (reviewed_by_id) REFERENCES ail_members (id);

ALTER TABLE ail_use_cases
  ADD FOREIGN KEY (level_id)    REFERENCES ail_levels (id),
  ADD FOREIGN KEY (category_id) REFERENCES ail_categories (id);

ALTER TABLE ail_use_case_submissions
  ADD FOREIGN KEY (member_id)      REFERENCES ail_members (id),
  ADD FOREIGN KEY (use_case_id)    REFERENCES ail_use_cases (id),
  ADD FOREIGN KEY (assigned_by_id) REFERENCES ail_members (id),
  ADD FOREIGN KEY (reviewed_by_id) REFERENCES ail_members (id);

--------------
-- Triggers --
--------------

CREATE TRIGGER update_ail_groups_updated_at_trigger
  BEFORE UPDATE ON ail_groups
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_levels_updated_at_trigger
  BEFORE UPDATE ON ail_levels
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_chapters_updated_at_trigger
  BEFORE UPDATE ON ail_chapters
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_quizzes_updated_at_trigger
  BEFORE UPDATE ON ail_quizzes
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_videos_updated_at_trigger
  BEFORE UPDATE ON ail_videos
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_materials_updated_at_trigger
  BEFORE UPDATE ON ail_materials
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_quiz_questions_updated_at_trigger
  BEFORE UPDATE ON ail_quiz_questions
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_prompts_updated_at_trigger
  BEFORE UPDATE ON ail_prompts
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_use_cases_updated_at_trigger
  BEFORE UPDATE ON ail_use_cases
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_prompt_submissions_updated_at_trigger
  BEFORE UPDATE ON ail_prompt_submissions
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ail_use_case_submissions_updated_at_trigger
  BEFORE UPDATE ON ail_use_case_submissions
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
