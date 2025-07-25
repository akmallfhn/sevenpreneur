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
  'video_course',
  'ai'
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

CREATE TABLE industries (
  id             SMALLSERIAL  PRIMARY KEY,
  industry_name  VARCHAR      NOT NULL  UNIQUE,
  created_at     TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entrepreneur_stages (
  id          SMALLSERIAL  PRIMARY KEY,
  stage_name  VARCHAR      NOT NULL  UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id          SMALLSERIAL  PRIMARY KEY,
  name        VARCHAR      NOT NULL  UNIQUE,
  permission  SMALLINT     NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phone_country_codes (
  id            SMALLSERIAL  PRIMARY KEY,
  country_name  VARCHAR  NOT NULL,
  phone_code    VARCHAR  NOT NULL  UNIQUE,
  emoji         VARCHAR  NOT NULL
);

CREATE TABLE payment_channels (
  id            SMALLSERIAL  PRIMARY KEY,
  label         VARCHAR        NOT NULL,
  code          VARCHAR        NOT NULL  UNIQUE,
  method        VARCHAR        NOT NULL,
  image         VARCHAR        NOT NULL,
  status        status_enum    NOT NULL  DEFAULT 'active',
  calc_percent  DECIMAL(6, 4)  NOT NULL,
  calc_flat     DECIMAL(5, 0)  NOT NULL,
  calc_vat      BOOLEAN        NOT NULL
);

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

CREATE TABLE transactions (
  id               CHAR(21) DEFAULT nanoid() PRIMARY KEY,
  user_id          uuid            NOT NULL,
  category         category_enum   NOT NULL,
  item_id          INTEGER         NOT NULL,
  amount           DECIMAL(12, 2)  NOT NULL,
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

-- Relation Tables --

CREATE TABLE users_cohorts (
  user_id    UUID     NOT NULL,
  cohort_id  INTEGER  NOT NULL,
  PRIMARY KEY (user_id, cohort_id)
);

----------------
-- References --
----------------

ALTER TABLE users
  ADD FOREIGN KEY (phone_country_id) REFERENCES phone_country_codes (id),
  ADD FOREIGN KEY (role_id)          REFERENCES roles (id);

ALTER TABLE tokens
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE cohorts
  ADD FOREIGN KEY (deleted_by) REFERENCES users (id);

ALTER TABLE cohort_prices
  ADD FOREIGN KEY (cohort_id) REFERENCES cohorts (id);

ALTER TABLE modules
  ADD FOREIGN KEY (cohort_id) REFERENCES cohorts (id);

ALTER TABLE learnings
  ADD FOREIGN KEY (cohort_id)  REFERENCES cohorts (id),
  ADD FOREIGN KEY (speaker_id) REFERENCES users (id);

ALTER TABLE materials
  ADD FOREIGN KEY (learning_id) REFERENCES learnings (id);

ALTER TABLE projects
  ADD FOREIGN KEY (cohort_id) REFERENCES cohorts (id);

ALTER TABLE transactions
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE users_cohorts
  ADD FOREIGN KEY (user_id)   REFERENCES users (id),
  ADD FOREIGN KEY (cohort_id) REFERENCES cohorts (id);

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

CREATE TRIGGER update_roles_updated_at_trigger
  BEFORE UPDATE ON roles
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

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

CREATE TRIGGER update_projects_updated_at_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at_trigger
  BEFORE UPDATE ON transactions
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
