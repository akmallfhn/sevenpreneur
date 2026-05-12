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

-------- NEED CONFIRMATION PRODUCT MANAGER -----------

-- Catalog of prompt templates members can practice against
-- scenario: business situation the prompt is meant for
-- expected_output: what a good response should look like

-- CREATE TABLE ail_prompts (
--     id              SERIAL       PRIMARY KEY,
--     name            VARCHAR      NOT NULL,
--     scenario        TEXT         NOT NULL,
--     expected_output TEXT         NOT NULL,
--     category_id     SMALLINT     NOT NULL,
--     status          status_enum  NOT NULL DEFAULT 'active',
--     created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE ail_prompt_submissions (
--     id                  SERIAL       PRIMARY KEY,
--     member_id           INTEGER      NOT NULL,
--     prompt_id           INTEGER      NOT NULL,
--     input               TEXT         NOT NULL,
--     output              TEXT         NOT NULL,
--     clarity_specificity SMALLINT     NOT NULL,
--     context_relevancy   SMALLINT     NOT NULL,
--     instruction_quality SMALLINT     NOT NULL,
--     output_expectation  SMALLINT     NOT NULL,
--     best_practices      SMALLINT     NOT NULL,
--     created_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE ail_use_cases (
--     id          SERIAL       PRIMARY KEY,
--     name        VARCHAR      NOT NULL,
--     category_id SMALLINT     NOT NULL,
--     description TEXT         NOT NULL,
--     status      status_enum  NOT NULL DEFAULT 'active',
--     created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE ail_use_case_submissions (
--     id            SERIAL                       PRIMARY KEY,
--     member_id     INTEGER                      NOT NULL,
--     use_case_id   INTEGER                      NOT NULL,
--     outcome_proof VARCHAR                      NOT NULL,
--     hours_saved   DECIMAL(6, 2)                NOT NULL,
--     description   TEXT                         NOT NULL,
--     ai_tool       VARCHAR                      NOT NULL,
--     frequency     ail_use_case_frequency       NOT NULL,
--     created_at    TIMESTAMPTZ                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at    TIMESTAMPTZ                  NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

------------------------------------------------------------------------

-- Relation Tables --

CREATE TABLE ail_group_members (
    group_id  INTEGER      NOT NULL,
    member_id INTEGER      NOT NULL,
    joined_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, member_id)
);

CREATE TABLE ail_quiz_submissions (
    id             SERIAL       PRIMARY KEY,
    member_id      INTEGER      NOT NULL,
    quiz_id        VARCHAR      NOT NULL,
    attempt_number SMALLINT     NOT NULL,
    answers        JSON         NOT NULL,
    score          SMALLINT     NOT NULL,
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

----------------
-- References --
----------------

ALTER TABLE ail_members
  ADD FOREIGN KEY (user_id)          REFERENCES users (id),
  ADD FOREIGN KEY (current_level_id) REFERENCES ail_levels (id);

ALTER TABLE ail_groups
  ADD FOREIGN KEY (champion_id) REFERENCES ail_members (id);

ALTER TABLE ail_group_members
  ADD FOREIGN KEY (group_id)  REFERENCES ail_groups (id),
  ADD FOREIGN KEY (member_id) REFERENCES ail_members (id);

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
