-- PostgreSQL Database for Sevenpreneur

------------------
-- Enumerations --
------------------

CREATE TYPE status_enum AS ENUM (
  'active',
  'inactive'
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

CREATE TABLE users (
  id                  UUID         PRIMARY KEY  DEFAULT gen_random_uuid(),
  full_name           VARCHAR      NOT NULL,
  email               VARCHAR      NOT NULL     UNIQUE,
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

----------------
-- References --
----------------

ALTER TABLE users
  ADD FOREIGN KEY (role_id) REFERENCES roles (id);

ALTER TABLE tokens
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

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
