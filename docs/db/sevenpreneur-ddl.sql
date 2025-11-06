-- PostgreSQL Database for Sevenpreneur

------------------
-- Enumerations --
------------------

CREATE TYPE status_enum AS ENUM (
  'active',
  'inactive'
);

CREATE TYPE learning_method_enum AS ENUM (
  'online',
  'onsite',
  'hybrid'
);

CREATE TYPE category_enum AS ENUM (
  'cohort',
  'playlist',
  'ai',
  'event'
);

-- Enumeration for the transactions table (t_*)

CREATE TYPE t_status_enum AS ENUM (
  'pending',
  'paid',
  'failed'
);

------------
-- Tables --
------------

-- Lookup tables

CREATE TABLE roles (
  id          SMALLSERIAL  PRIMARY KEY,
  name        VARCHAR      NOT NULL  UNIQUE,
  permission  SMALLINT     NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entrepreneur_stages (
  id          SMALLSERIAL  PRIMARY KEY,
  stage_name  VARCHAR      NOT NULL  UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE industries (
  id             SMALLSERIAL  PRIMARY KEY,
  industry_name  VARCHAR      NOT NULL  UNIQUE,
  created_at     TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phone_country_codes (
  id            SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  country_name  VARCHAR  NOT NULL,
  phone_code    VARCHAR  NOT NULL  UNIQUE,
  emoji         VARCHAR  NOT NULL
);

CREATE TABLE payment_channels (
  id            SMALLSERIAL    PRIMARY KEY,
  label         VARCHAR        NOT NULL,
  code          VARCHAR        NOT NULL  UNIQUE,
  method        VARCHAR        NOT NULL,
  image         VARCHAR        NOT NULL,
  status        status_enum    NOT NULL  DEFAULT 'active',
  calc_percent  DECIMAL(6, 4)  NOT NULL,
  calc_flat     DECIMAL(5, 0)  NOT NULL,
  calc_vat      BOOLEAN        NOT NULL
);

-- User data

CREATE TABLE users (
  id                  UUID         PRIMARY KEY  DEFAULT gen_random_uuid(),
  full_name           VARCHAR      NOT NULL,
  email               VARCHAR      NOT NULL     UNIQUE,
  phone_country_id    SMALLINT         NULL,
  phone_number        VARCHAR          NULL,
  avatar              VARCHAR          NULL,
  role_id             SMALLINT     NOT NULL     DEFAULT 3, -- General User
  status              status_enum  NOT NULL     DEFAULT 'active',
  date_of_birth       DATE             NULL,
  learning_goal       VARCHAR          NULL,
  entrepreneur_stage  SMALLINT         NULL,
  business_name       VARCHAR          NULL,
  industry_id         SMALLINT         NULL,
  created_at          TIMESTAMPTZ  NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ  NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  last_login          TIMESTAMPTZ  NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  deleted_at          TIMESTAMPTZ      NULL
);

CREATE TABLE tokens (
  id          SERIAL       PRIMARY KEY,
  user_id     UUID         NOT NULL,
  is_active   BOOLEAN      NOT NULL  DEFAULT FALSE,
  token       TEXT         NOT NULL  UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- LMS-related

CREATE TABLE cohorts (
  id            SERIAL       PRIMARY KEY,
  name          VARCHAR      NOT NULL,
  description   VARCHAR      NOT NULL,
  image         VARCHAR      NOT NULL,
  status        status_enum  NOT NULL,
  slug_url      VARCHAR      NOT NULL  UNIQUE,
  start_date    TIMESTAMPTZ  NOT NULL,
  end_date      TIMESTAMPTZ  NOT NULL,
  published_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMPTZ      NULL,
  deleted_by    UUID             NULL
);

CREATE TABLE cohort_prices (
  id          SERIAL          PRIMARY KEY,
  cohort_id   INTEGER         NOT NULL,
  name        VARCHAR         NOT NULL,
  amount      DECIMAL(12, 2)  NOT NULL,
  status      status_enum     NOT NULL,
  created_at  TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modules (
  id            SERIAL       PRIMARY KEY,
  cohort_id     INTEGER      NOT NULL,
  name          VARCHAR      NOT NULL,
  description   VARCHAR          NULL,
  document_url  VARCHAR      NOT NULL,
  status        status_enum  NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learnings (
  id             SERIAL                PRIMARY KEY,
  cohort_id      INTEGER               NOT NULL,
  name           VARCHAR               NOT NULL,
  description    VARCHAR               NOT NULL,
  method         learning_method_enum  NOT NULL,
  meeting_date   TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  meeting_url    VARCHAR                   NULL,
  location_name  VARCHAR                   NULL,
  location_url   VARCHAR                   NULL,
  speaker_id     UUID                      NULL,
  recording_url  VARCHAR                   NULL,
  price_id       INTEGER                   NULL,
  status         status_enum           NOT NULL,
  created_at     TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE materials (
  id            SERIAL       PRIMARY KEY,
  learning_id   INTEGER      NOT NULL,
  name          VARCHAR      NOT NULL,
  description   VARCHAR          NULL,
  document_url  VARCHAR      NOT NULL,
  status        status_enum  NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discussion_starters (
  id           SERIAL       PRIMARY KEY,
  user_id      UUID         NOT NULL,
  learning_id  INTEGER      NOT NULL,
  message      TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discussion_replies (
  id          SERIAL       PRIMARY KEY,
  user_id     UUID         NOT NULL,
  starter_id  INTEGER      NOT NULL,
  message     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id            SERIAL       PRIMARY KEY,
  cohort_id     INTEGER      NOT NULL,
  name          VARCHAR      NOT NULL,
  description   VARCHAR      NOT NULL,
  document_url  VARCHAR          NULL,
  deadline_at   TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  status        status_enum  NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions (
  id            SERIAL       PRIMARY KEY,
  project_id    INTEGER      NOT NULL,
  submitter_id  UUID         NOT NULL,
  document_url  VARCHAR          NULL,
  comment       TEXT             NULL,
  created_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Playlist-related

CREATE TABLE playlists (
  id                 SERIAL          PRIMARY KEY,
  name               VARCHAR         NOT NULL,
  tagline            VARCHAR         NOT NULL,
  description        TEXT            NOT NULL,
  video_preview_url  VARCHAR         NOT NULL,
  image_url          VARCHAR         NOT NULL,
  price              DECIMAL(12, 2)  NOT NULL,
  status             status_enum     NOT NULL,
  slug_url           VARCHAR         NOT NULL,
  published_at       TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  deleted_at         TIMESTAMPTZ         NULL,
  deleted_by         UUID                NULL
);

CREATE TABLE videos (
  id                 SERIAL       PRIMARY KEY,
  playlist_id        INTEGER      NOT NULL,
  name               VARCHAR      NOT NULL,
  description        TEXT             NULL,
  duration           INTEGER      NOT NULL,
  image_url          VARCHAR      NOT NULL,
  video_url          VARCHAR      NOT NULL,
  num_order          SMALLINT     NOT NULL  DEFAULT 0,
  external_video_id  VARCHAR      NOT NULL,
  status             status_enum  NOT NULL
);

-- Event-related

CREATE TABLE events (
  id             SERIAL                PRIMARY KEY,
  name           VARCHAR               NOT NULL,
  description    VARCHAR               NOT NULL,
  image          VARCHAR               NOT NULL,
  status         status_enum           NOT NULL,
  slug_url       VARCHAR               NOT NULL  UNIQUE,
  start_date     TIMESTAMPTZ           NOT NULL,
  end_date       TIMESTAMPTZ           NOT NULL,
  method         learning_method_enum  NOT NULL  DEFAULT 'onsite',
  meeting_url    VARCHAR                   NULL,
  location_name  VARCHAR                   NULL,
  location_url   VARCHAR                   NULL,
  published_at   TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  deleted_at     TIMESTAMPTZ               NULL,
  deleted_by     UUID                      NULL
);

CREATE TABLE event_prices (
  id          SERIAL          PRIMARY KEY,
  event_id    INTEGER         NOT NULL,
  name        VARCHAR         NOT NULL,
  amount      DECIMAL(12, 2)  NOT NULL,
  status      status_enum     NOT NULL,
  created_at  TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Template-related

CREATE TABLE templates (
  id            SERIAL       PRIMARY KEY,
  name          VARCHAR      NOT NULL,
  description   VARCHAR          NULL,
  image         VARCHAR      NOT NULL,
  document_url  VARCHAR      NOT NULL,
  status        status_enum  NOT NULL,
  tags          VARCHAR      NOT NULL  DEFAULT '',
  created_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- AI-tool-related

CREATE TABLE ai_tools (
  id           SMALLSERIAL  PRIMARY KEY,
  name         VARCHAR      NOT NULL,
  description  VARCHAR          NULL,
  slug_url     VARCHAR      NOT NULL,
  status       status_enum  NOT NULL
);

CREATE TABLE ai_results (
  id          CHAR(21) DEFAULT nanoid() PRIMARY KEY,
  user_id     UUID         NOT NULL,
  ai_tool_id  SMALLINT     NOT NULL,
  name        VARCHAR      NOT NULL,
  result      JSON         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Transaction-related

CREATE TABLE discounts (
  id            SERIAL         PRIMARY KEY,
  name          VARCHAR        NOT NULL,
  code          VARCHAR        NOT NULL,
  category      category_enum  NOT NULL,
  item_id       INTEGER        NOT NULL,
  calc_percent  DECIMAL(6, 4)  NOT NULL,
  status        status_enum    NOT NULL,
  start_date    TIMESTAMPTZ    NOT NULL,
  end_date      TIMESTAMPTZ    NOT NULL,
  created_at    TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id               CHAR(21) DEFAULT nanoid() PRIMARY KEY,
  user_id          UUID            NOT NULL,
  category         category_enum   NOT NULL,
  item_id          INTEGER         NOT NULL,
  amount           DECIMAL(12, 2)  NOT NULL,
  discount_id      INTEGER             NULL,
  discount_amount  DECIMAL(12, 2)  NOT NULL  DEFAULT 0,
  admin_fee        DECIMAL(12, 2)  NOT NULL,
  vat              DECIMAL(12, 2)  NOT NULL,
  currency         VARCHAR         NOT NULL,
  invoice_number   VARCHAR         NOT NULL,
  status           t_status_enum   NOT NULL,
  payment_method   VARCHAR         NOT NULL,
  payment_channel  VARCHAR         NOT NULL,
  paid_at          TIMESTAMPTZ         NULL,
  created_at       TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Tickers

CREATE TABLE ticker (
  id          INTEGER      PRIMARY KEY  DEFAULT 1,
  title       VARCHAR      NOT NULL,
  callout     VARCHAR          NULL,
  target_url  VARCHAR      NOT NULL,
  status      status_enum  NOT NULL,
  start_date  TIMESTAMPTZ  NOT NULL,
  end_date    TIMESTAMPTZ  NOT NULL,
  updated_at  TIMESTAMPTZ  NOT NULL     DEFAULT CURRENT_TIMESTAMP
);

-- Relation Tables --

CREATE TABLE users_cohorts (
  user_id          UUID     NOT NULL,
  cohort_id        INTEGER  NOT NULL,
  cohort_price_id  INTEGER  NOT NULL,
  PRIMARY KEY (user_id, cohort_id)
);

CREATE TABLE users_playlists (
  user_id      UUID     NOT NULL,
  playlist_id  INTEGER  NOT NULL,
  rating       INTEGER      NULL,
  review       VARCHAR      NULL,
  PRIMARY KEY (user_id, playlist_id)
);

CREATE TABLE educators_playlists (
  user_id      UUID     NOT NULL,
  playlist_id  INTEGER  NOT NULL,
  PRIMARY KEY (user_id, playlist_id)
);

CREATE TABLE users_events (
  user_id   UUID     NOT NULL,
  event_id  INTEGER  NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

CREATE VIEW users_templates AS
  SELECT user_id FROM users_cohorts;

CREATE VIEW users_ai_tools AS
  SELECT user_id FROM users_cohorts;

----------------
-- References --
----------------

-- User data

ALTER TABLE users
  ADD FOREIGN KEY (phone_country_id)   REFERENCES phone_country_codes (id),
  ADD FOREIGN KEY (role_id)            REFERENCES roles (id),
  ADD FOREIGN KEY (entrepreneur_stage) REFERENCES entrepreneur_stages (id),
  ADD FOREIGN KEY (industry_id)        REFERENCES industries (id);

ALTER TABLE tokens
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

-- LMS-related

ALTER TABLE cohorts
  ADD FOREIGN KEY (deleted_by) REFERENCES users (id);

ALTER TABLE cohort_prices
  ADD FOREIGN KEY (cohort_id) REFERENCES cohorts (id);

ALTER TABLE modules
  ADD FOREIGN KEY (cohort_id) REFERENCES cohorts (id);

ALTER TABLE learnings
  ADD FOREIGN KEY (cohort_id)  REFERENCES cohorts (id),
  ADD FOREIGN KEY (speaker_id) REFERENCES users (id),
  ADD FOREIGN KEY (price_id)   REFERENCES cohort_prices (id);

ALTER TABLE materials
  ADD FOREIGN KEY (learning_id) REFERENCES learnings (id);

ALTER TABLE discussion_starters
  ADD FOREIGN KEY (user_id)     REFERENCES users (id),
  ADD FOREIGN KEY (learning_id) REFERENCES learnings (id);

ALTER TABLE discussion_replies
  ADD FOREIGN KEY (user_id)    REFERENCES users (id),
  ADD FOREIGN KEY (starter_id) REFERENCES discussion_starters (id);

ALTER TABLE projects
  ADD FOREIGN KEY (cohort_id) REFERENCES cohorts (id);

ALTER TABLE submissions
  ADD FOREIGN KEY (project_id)   REFERENCES projects (id),
  ADD FOREIGN KEY (submitter_id) REFERENCES users (id);

-- Playlist-related

ALTER TABLE playlists
  ADD FOREIGN KEY (deleted_by) REFERENCES users (id);

ALTER TABLE videos
  ADD FOREIGN KEY (playlist_id) REFERENCES playlists (id);

-- Event-related

ALTER TABLE events
  ADD FOREIGN KEY (deleted_by) REFERENCES users (id);

ALTER TABLE event_prices
  ADD FOREIGN KEY (event_id) REFERENCES events(id);

-- AI-tool-related

ALTER TABLE ai_results
  ADD FOREIGN KEY (user_id)    REFERENCES users (id),
  ADD FOREIGN KEY (ai_tool_id) REFERENCES ai_tools (id);

-- Transaction-related

ALTER TABLE transactions
  ADD FOREIGN KEY (user_id) REFERENCES users (id),
  ADD FOREIGN KEY (discount_id) REFERENCES discounts (id);

-- Relation Tables --

ALTER TABLE users_cohorts
  ADD FOREIGN KEY (user_id)         REFERENCES users (id),
  ADD FOREIGN KEY (cohort_id)       REFERENCES cohorts (id),
  ADD FOREIGN KEY (cohort_price_id) REFERENCES cohort_prices (id);

ALTER TABLE users_events
  ADD FOREIGN KEY (user_id)   REFERENCES users (id),
  ADD FOREIGN KEY (event_id)  REFERENCES events (id);

ALTER TABLE users_playlists
  ADD FOREIGN KEY (user_id)   REFERENCES users (id),
  ADD FOREIGN KEY (playlist_id) REFERENCES playlists (id);

ALTER TABLE educators_playlists
  ADD FOREIGN KEY (user_id)   REFERENCES users (id),
  ADD FOREIGN KEY (playlist_id) REFERENCES playlists (id);

---------------
-- Functions --
---------------

CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

--------------
-- Triggers --
--------------

-- Lookup tables

CREATE TRIGGER update_roles_updated_at_trigger
  BEFORE UPDATE ON roles
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- User data

CREATE TRIGGER update_users_updated_at_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- LMS-related

CREATE TRIGGER update_cohorts_updated_at_trigger
  BEFORE UPDATE ON cohorts
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_modules_updated_at_trigger
  BEFORE UPDATE ON modules
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_learnings_updated_at_trigger
  BEFORE UPDATE ON learnings
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_materials_updated_at_trigger
  BEFORE UPDATE ON materials
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_discussion_starters_updated_at_trigger
  BEFORE UPDATE ON discussion_starters
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_discussion_replies_updated_at_trigger
  BEFORE UPDATE ON discussion_replies
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_submissions_updated_at_trigger
  BEFORE UPDATE ON submissions
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Playlist-related

CREATE TRIGGER update_playlists_updated_at_trigger
  BEFORE UPDATE ON playlists
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Event-related

CREATE TRIGGER update_events_updated_at_trigger
  BEFORE UPDATE ON events
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Template-related

CREATE TRIGGER update_templates_updated_at_trigger
  BEFORE UPDATE ON templates
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Transaction-related

CREATE TRIGGER update_discounts_updated_at_trigger
  BEFORE UPDATE ON discounts
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at_trigger
  BEFORE UPDATE ON transactions
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Tickers

CREATE TRIGGER update_ticker_updated_at_trigger
  BEFORE UPDATE ON ticker
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

------------------
-- Unique Index --
------------------

-- LMS-related

CREATE UNIQUE INDEX idx_submissions_unique_per_project ON submissions (project_id, submitter_id);

-- Transaction-related

CREATE UNIQUE INDEX idx_discounts_unique_combination ON discounts (code, category, item_id);

-- Tickers

CREATE UNIQUE INDEX one_row_only ON ticker ((true));
