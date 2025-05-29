-- PostgreSQL Database for Sevenpreneur
-- USE sevenpreneur;

------------------
-- Enumerations --
------------------

-- Enumeration for the users table (currently)

CREATE TYPE status_enum AS ENUM (
  'active',
  'inactive'
);

-- Enumeration for the users table (u_*)

CREATE TYPE u_stage_enum AS ENUM (
  'ideation',
  'feasibility_analysis',
  'business_planning',
  'execution',
  'growth'
);

CREATE TYPE u_industry_enum AS ENUM (
  'agriculture',
  'automotive',
  'biotechnology',
  'chemicals',
  'construction',
  'consulting',
  'consumer_goods',
  'education',
  'energy',
  'engineering',
  'entertainment',
  'environmental_services',
  'fashion',
  'financial_services',
  'food_and_beverage',
  'government',
  'healthcare',
  'hospitality',
  'human_resources',
  'information_technology',
  'insurance',
  'legal',
  'logistics_and_transportation',
  'manufacturing',
  'media',
  'mining',
  'non_profit',
  'pharmaceuticals',
  'public_relations',
  'real_estate',
  'retail',
  'telecommunications',
  'textiles',
  'tourism',
  'utilities'
);

------------
-- Tables --
------------

CREATE TABLE users (
  id                  UUID             PRIMARY KEY  DEFAULT gen_random_uuid(),
  full_name           VARCHAR          NOT NULL,
  email               VARCHAR          NOT NULL     UNIQUE,
  avatar              VARCHAR              NULL,
  role_id             SMALLINT         NOT NULL,
  status              status_enum      NOT NULL,
  date_of_birth       DATE             NOT NULL,
  learning_goal       VARCHAR          NOT NULL,
  entrepreneur_stage  u_stage_enum         NULL,
  business_name       VARCHAR              NULL,
  industry            u_industry_enum  NOT NULL,
  created_at          TIMESTAMPTZ      NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ      NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  last_login          TIMESTAMPTZ      NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  deleted_at          TIMESTAMPTZ          NULL
);

CREATE TABLE tokens (
  id          SERIAL       PRIMARY KEY,
  user_id     UUID         NOT NULL,
  is_active   BOOLEAN      NOT NULL  DEFAULT FALSE,
  token       TEXT         NOT NULL  UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id          SMALLSERIAL  PRIMARY KEY,
  name        VARCHAR      NOT NULL,
  permission  SMALLINT     NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
