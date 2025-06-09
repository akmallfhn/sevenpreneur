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
