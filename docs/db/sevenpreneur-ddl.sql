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

-- Enumeration for the ai_chats table (c_*)

CREATE TYPE c_role_enum AS ENUM (
  'user',
  'assistant'
);

-- Enumeration for the ba_answer_sheets table (ba_*)

CREATE TYPE ba_period_enum AS ENUM (
  'asesmen_pertama',
  'asesmen_kedua',
  'asesmen_ketiga'
);

-- Enumeration for the bd_fin_cost_mtds table (cost_*)

CREATE TYPE cost_category_enum AS ENUM (
  -- TODO: use actual values
  'todo'
);

-- Enumeration for the bd_north_star_indicators table (ns_*)

CREATE TYPE ns_status_enum AS ENUM (
  'on_track',
  'at_risk',
  'off_track'
);

-- Enumeration for the users table

CREATE TYPE occupation_enum AS ENUM (
  'employee',
  'entrepreneur',
  'student',
  'freelance',
  'military',
  'unemployed'
);

CREATE TYPE revenue_enum AS ENUM (
  'below_50m',
  'between_50m_100m',
  'between_100m_500m',
  'between_500m_1b',
  'between_1b_10b',
  'between_10b_25b',
  'above_25b'
);

CREATE TYPE num_employee_enum AS ENUM (
  'small',
  'medium',
  'large',
  'xlarge',
  'xxlarge'
);

CREATE TYPE legal_entity_enum AS ENUM (
  'cv',
  'pt',
  'pt_tbk',
  'persero',
  'firma',
  'koperasi',
  'yayasan',
  'ud',
  'non_legal_entity'
);

-- Enumeration for the articles table (a_*)

CREATE TYPE a_status_enum AS ENUM (
  'draft',
  'published',
  'unpublished'
);

-- Enumeration for the wa_conversations table (wa_*)

CREATE TYPE wa_lead_status AS ENUM (
  'cold',
  'warm',
  'hot'
);

-- Enumeration for the wa_chats table (wac_*)

CREATE TYPE wac_direction AS ENUM (
  'inbound',
  'outbound'
);

CREATE TYPE wac_sender_type AS ENUM (
  'user',
  'admin'
);

CREATE TYPE wac_type AS ENUM (
  'audio',
  'button',
  'contacts',
  'document',
  'edit',
  'image',
  'interactive',
  'location',
  'order',
  'reaction',
  'revoke',
  'sticker',
  'system',
  'text',
  'unsupported',
  'video'
);

CREATE TYPE wac_status AS ENUM (
  'sent',
  'delivered',
  'read',
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
  id                     UUID               PRIMARY KEY  DEFAULT gen_random_uuid(),
  full_name              VARCHAR            NOT NULL,
  email                  VARCHAR            NOT NULL     UNIQUE,
  phone_country_id       SMALLINT               NULL,
  phone_number           VARCHAR                NULL,
  avatar                 VARCHAR                NULL,
  role_id                SMALLINT           NOT NULL     DEFAULT 3, -- General User
  status                 status_enum        NOT NULL     DEFAULT 'active',
  date_of_birth          DATE                   NULL,
  business_name          VARCHAR                NULL,
  industry_id            SMALLINT               NULL,
  business_description   TEXT                   NULL,
  occupation             occupation_enum        NULL,
  yearly_revenue         revenue_enum           NULL,
  total_employees        num_employee_enum      NULL,
  company_profile_url    VARCHAR                NULL,
  business_age_years     INTEGER                NULL,
  legal_entity_type      legal_entity_enum      NULL,
  average_selling_price  DECIMAL(12, 2)         NULL,
  created_at             TIMESTAMPTZ        NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMPTZ        NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  last_login             TIMESTAMPTZ        NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  deleted_at             TIMESTAMPTZ            NULL
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
  image_banner  VARCHAR      NOT NULL,
  image_square  VARCHAR      NOT NULL,
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
  id                 SERIAL                PRIMARY KEY,
  cohort_id          INTEGER               NOT NULL,
  name               VARCHAR               NOT NULL,
  description        VARCHAR               NOT NULL,
  method             learning_method_enum  NOT NULL,
  meeting_date       TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  meeting_url        VARCHAR                   NULL,
  location_name      VARCHAR                   NULL,
  location_url       VARCHAR                   NULL,
  speaker_id         UUID                      NULL,
  recording_url      VARCHAR                   NULL,
  external_video_id  VARCHAR                   NULL,
  price_id           INTEGER                   NULL,
  status             status_enum           NOT NULL,
  check_in           BOOLEAN               NOT NULL  DEFAULT FALSE,
  check_out          BOOLEAN               NOT NULL  DEFAULT FALSE,
  check_out_code     VARCHAR                   NULL,
  feedback_form      VARCHAR                   NULL,
  created_at         TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMPTZ           NOT NULL  DEFAULT CURRENT_TIMESTAMP
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
  is_favorite   BOOLEAN      NOT NULL  DEFAULT FALSE,
  created_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendances (
  learning_id   INTEGER      NOT NULL,
  user_id       UUID         NOT NULL,
  check_in_at   TIMESTAMPTZ      NULL,
  check_out_at  TIMESTAMPTZ      NULL,
  PRIMARY KEY (learning_id, user_id)
);

-- Business-assessment-related

CREATE TABLE ba_categories (
  id          SMALLSERIAL    PRIMARY KEY,
  name        VARCHAR        NOT NULL,
  weight      DECIMAL(5, 2)  NOT NULL, -- in percent (%)
  num_order   SMALLINT           NULL,
  created_at  TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ba_subcategories (
  id           SMALLSERIAL  PRIMARY KEY,
  category_id  SMALLINT     NOT NULL,
  name         VARCHAR      NOT NULL,
  num_order    SMALLINT         NULL,
  created_at   TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ba_questions (
  id              SERIAL         PRIMARY KEY,
  subcategory_id  SMALLINT       NOT NULL,
  question        VARCHAR        NOT NULL,
  hint            VARCHAR        NOT NULL,
  weight          DECIMAL(4, 2)  NOT NULL,
  status          status_enum    NOT NULL,
  num_order       SMALLINT           NULL,
  created_at      TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ba_answer_sheets (
  id          SERIAL          PRIMARY KEY,
  user_id     UUID            NOT NULL,
  period      ba_period_enum  NOT NULL,
  score       DECIMAL(5, 2)   NOT NULL, -- in percent (%)
  created_at  TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ba_answer_items (
  id           SERIAL       PRIMARY KEY,
  sheet_id     INTEGER      NOT NULL,
  question_id  INTEGER      NOT NULL,
  score        SMALLINT     NOT NULL, -- in [0, 5] range
  created_at   TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Business-metric-related

CREATE TABLE bd_fin_revenue_mtds (
  id          SERIAL          PRIMARY KEY,
  user_id     UUID            NOT NULL,
  year        SMALLINT        NOT NULL,
  month       SMALLINT        NOT NULL,
  amount      DECIMAL(12, 2)  NOT NULL,
  currency    VARCHAR         NOT NULL,
  by_product  JSON            NOT NULL,
  by_channel  JSON            NOT NULL,
  note        VARCHAR             NULL,
  created_at  TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bd_fin_cost_mtds (
  id          SERIAL              PRIMARY KEY,
  user_id     UUID                NOT NULL,
  year        SMALLINT            NOT NULL,
  month       SMALLINT            NOT NULL,
  amount      DECIMAL(12, 2)      NOT NULL,
  currency    VARCHAR             NOT NULL,
  category    cost_category_enum  NOT NULL,
  note        VARCHAR                 NULL,
  created_at  TIMESTAMPTZ         NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ         NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bd_north_star_indicators (
  id             SERIAL          PRIMARY KEY,
  user_id        UUID            NOT NULL,
  name           VARCHAR         NOT NULL,
  description    TEXT            NOT NULL,
  annual_target  DECIMAL(12, 2)  NOT NULL,
  unit           VARCHAR         NOT NULL,
  status         ns_status_enum  NOT NULL,
  created_at     TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bd_north_star_mtds (
  id            SERIAL          PRIMARY KEY,
  indicator_id  SERIAL          NOT NULL,
  year          SMALLINT        NOT NULL,
  month         SMALLINT        NOT NULL,
  actual_value  DECIMAL(12, 2)  NOT NULL,
  note          VARCHAR             NULL,
  created_at    TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Playlist-related

CREATE TABLE playlists (
  id                 SERIAL          PRIMARY KEY,
  name               VARCHAR         NOT NULL,
  tagline            VARCHAR         NOT NULL,
  description        TEXT            NOT NULL,
  video_preview_url  VARCHAR         NOT NULL,
  image_url          VARCHAR         NOT NULL,
  image_banner_url   VARCHAR         NOT NULL,
  image_square_url   VARCHAR         NOT NULL,
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
  is_done     BOOLEAN      NOT NULL  DEFAULT FALSE,
  qstash_id   VARCHAR          NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- AI-chat-related

CREATE TABLE ai_conversations (
  id          CHAR(21) DEFAULT nanoid() PRIMARY KEY,
  user_id     UUID         NOT NULL,
  name        VARCHAR      NOT NULL,
  is_done     BOOLEAN      NOT NULL  DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_chats (
  id          CHAR(21) DEFAULT nanoid() PRIMARY KEY,
  conv_id     CHAR(21)     NOT NULL,
  role        c_role_enum  NOT NULL,
  message     TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Transaction-related

/**
 * The item_id column refers to
 * - cohort_prices.id if the category is cohort,
 * - playlists.id     if the category is playlist, or
 * - event_prices.id  if the category is event.
 */

CREATE TABLE discounts (
  id            SERIAL         PRIMARY KEY,
  name          VARCHAR        NOT NULL,
  code          VARCHAR        NOT NULL,
  category      category_enum  NOT NULL,
  item_id       INTEGER        NOT NULL,
  calc_percent  DECIMAL(7, 4)  NOT NULL,
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

-- Article-related

CREATE TABLE article_categories (
  id          SMALLSERIAL  PRIMARY KEY,
  name        VARCHAR      NOT NULL,
  status      status_enum  NOT NULL,
  slug        VARCHAR      NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
  id            SERIAL         PRIMARY KEY,
  title         VARCHAR        NOT NULL,
  insight       VARCHAR        NOT NULL,
  image_url     VARCHAR        NOT NULL,
  body_content  JSON           NOT NULL,
  status        a_status_enum  NOT NULL,
  category_id   SMALLINT       NOT NULL,
  keywords      VARCHAR        NOT NULL,
  author_id     UUID           NOT NULL,
  reviewer_id   UUID           NOT NULL,
  slug_url      VARCHAR        NOT NULL,
  published_at  TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ    NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Interstitial Ads

CREATE TABLE interstitial_ads (
  id              INTEGER      PRIMARY KEY  DEFAULT 1,
  title           VARCHAR      NOT NULL,
  call_to_action  VARCHAR          NULL,
  target_url      VARCHAR      NOT NULL,
  image_desktop   VARCHAR          NULL,
  image_mobile    VARCHAR          NULL,
  status          status_enum  NOT NULL,
  start_date      TIMESTAMPTZ  NOT NULL,
  end_date        TIMESTAMPTZ  NOT NULL,
  updated_at      TIMESTAMPTZ  NOT NULL     DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp-chat-related

CREATE TABLE wa_conversations (
  id            CHAR(21) DEFAULT nanoid() PRIMARY KEY,
  user_id       UUID                NULL,
  full_name     VARCHAR         NOT NULL,
  phone_number  VARCHAR         NOT NULL,
  handler_id    UUID                NULL,
  lead_status   wa_lead_status  NOT NULL  DEFAULT 'cold',
  winning_rate  SMALLINT        NOT NULL  DEFAULT 0,
  note          VARCHAR             NULL,
  last_read_id  CHAR(21)            NULL,
  created_at    TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ     NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wa_chats (
  id            CHAR(21) DEFAULT nanoid() PRIMARY KEY,
  conv_id       CHAR(21)         NOT NULL,
  wam_id        VARCHAR          NOT NULL,
  direction     wac_direction    NOT NULL,
  sender_type   wac_sender_type  NOT NULL,
  reply_to_id   CHAR(21)             NULL,
  type          wac_type         NOT NULL,
  message       VARCHAR          NOT NULL,
  attachment    JSON                 NULL,
  status        wac_status           NULL,
  sent_at       TIMESTAMPTZ          NULL,
  delivered_at  TIMESTAMPTZ          NULL,
  read_at       TIMESTAMPTZ          NULL,
  failed_at     TIMESTAMPTZ          NULL,
  created_at    TIMESTAMPTZ      NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ      NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

-- Relation Tables --

CREATE TABLE users_cohorts (
  user_id          UUID     NOT NULL,
  cohort_id        INTEGER  NOT NULL,
  cohort_price_id  INTEGER  NOT NULL,
  certificate_url  VARCHAR      NULL,
  is_scout         BOOLEAN  NOT NULL  DEFAULT FALSE,
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
  ADD FOREIGN KEY (phone_country_id) REFERENCES phone_country_codes (id),
  ADD FOREIGN KEY (role_id)          REFERENCES roles (id),
  ADD FOREIGN KEY (industry_id)      REFERENCES industries (id);

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

ALTER TABLE attendances
  ADD FOREIGN KEY (learning_id) REFERENCES learnings (id),
  ADD FOREIGN KEY (user_id)     REFERENCES users (id);

ALTER TABLE ba_subcategories
  ADD FOREIGN KEY (category_id) REFERENCES ba_categories (id);

ALTER TABLE ba_questions
  ADD FOREIGN KEY (subcategory_id) REFERENCES ba_subcategories (id);

ALTER TABLE ba_answer_sheets
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE ba_answer_items
  ADD FOREIGN KEY (sheet_id)    REFERENCES ba_answer_sheets (id),
  ADD FOREIGN KEY (question_id) REFERENCES ba_questions (id);

-- Business-metric-related

ALTER TABLE bd_fin_revenue_mtds
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE bd_fin_cost_mtds
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE bd_north_star_indicators
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE bd_north_star_mtds
  ADD FOREIGN KEY (indicator_id) REFERENCES bd_north_star_indicators (id);

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

-- AI-chat-related

ALTER TABLE ai_conversations
  ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE ai_chats
  ADD FOREIGN KEY (conv_id) REFERENCES ai_conversations (id);

-- Transaction-related

ALTER TABLE transactions
  ADD FOREIGN KEY (user_id)     REFERENCES users (id),
  ADD FOREIGN KEY (discount_id) REFERENCES discounts (id);

-- Article-related

ALTER TABLE articles
  ADD FOREIGN KEY (category_id) REFERENCES article_categories (id),
  ADD FOREIGN KEY (author_id)   REFERENCES users (id),
  ADD FOREIGN KEY (reviewer_id) REFERENCES users (id);

-- WhatsApp-chat-related

ALTER TABLE wa_conversations
  ADD FOREIGN KEY (user_id)      REFERENCES users (id),
  ADD FOREIGN KEY (handler_id)   REFERENCES users (id),
  ADD FOREIGN KEY (last_read_id) REFERENCES wa_chats (id);

ALTER TABLE wa_chats
  ADD FOREIGN KEY (conv_id)     REFERENCES wa_conversations (id),
  ADD FOREIGN KEY (reply_to_id) REFERENCES wa_chats (id);

-- Relation Tables --

ALTER TABLE users_cohorts
  ADD FOREIGN KEY (user_id)         REFERENCES users (id),
  ADD FOREIGN KEY (cohort_id)       REFERENCES cohorts (id),
  ADD FOREIGN KEY (cohort_price_id) REFERENCES cohort_prices (id);

ALTER TABLE users_events
  ADD FOREIGN KEY (user_id)  REFERENCES users (id),
  ADD FOREIGN KEY (event_id) REFERENCES events (id);

ALTER TABLE users_playlists
  ADD FOREIGN KEY (user_id)     REFERENCES users (id),
  ADD FOREIGN KEY (playlist_id) REFERENCES playlists (id);

ALTER TABLE educators_playlists
  ADD FOREIGN KEY (user_id)     REFERENCES users (id),
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

CREATE OR REPLACE FUNCTION wa_get_unread_count(_conv_id CHAR(21))
  RETURNS INTEGER
  RETURN (
    SELECT COUNT(id)
    FROM wa_chats
    WHERE conv_id = _conv_id AND direction = 'inbound' AND created_at > (
      SELECT COALESCE(wa_chats.created_at, '2000-01-01 00:00:00Z'::TIMESTAMPTZ)
      FROM wa_conversations
      LEFT JOIN wa_chats ON wa_conversations.last_read_id = wa_chats.id
      WHERE wa_conversations.id = _conv_id
      LIMIT 1
    )
  );

-- Supabase Realtime

CREATE TYPE wa_broadcast_change_rows AS (id CHAR(21), conv_id CHAR(21), direction TEXT);

CREATE OR REPLACE FUNCTION wa_convs_change()
  RETURNS TRIGGER AS $$
  BEGIN
    PERFORM realtime.broadcast_changes(
      'wa_convs_change',
      TG_OP,
      TG_OP,
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      CASE WHEN TG_OP = 'DELETE' THEN NULL
           ELSE ROW(NEW.id, NEW.conv_id, NEW.direction::TEXT)::wa_broadcast_change_rows END,
      CASE WHEN TG_OP = 'INSERT' THEN NULL
           ELSE ROW(OLD.id, OLD.conv_id, OLD.direction::TEXT)::wa_broadcast_change_rows END
    );
    RETURN NULL;
  END
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION wa_chats_change()
  RETURNS TRIGGER AS $$
  BEGIN
    PERFORM realtime.broadcast_changes(
      'wa_chats_change',
      TG_OP,
      TG_OP,
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      CASE WHEN TG_OP = 'DELETE' THEN NULL
           ELSE ROW(NEW.id, NEW.conv_id, NEW.direction::TEXT)::wa_broadcast_change_rows END,
      CASE WHEN TG_OP = 'INSERT' THEN NULL
           ELSE ROW(OLD.id, OLD.conv_id, OLD.direction::TEXT)::wa_broadcast_change_rows END
    );
    RETURN NULL;
  END
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

CREATE TRIGGER update_ba_categories_updated_at_trigger
  BEFORE UPDATE ON ba_categories
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ba_subcategories_updated_at_trigger
  BEFORE UPDATE ON ba_subcategories
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ba_questions_updated_at_trigger
  BEFORE UPDATE ON ba_questions
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ba_answer_sheets_updated_at_trigger
  BEFORE UPDATE ON ba_answer_sheets
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ba_answer_items_updated_at_trigger
  BEFORE UPDATE ON ba_answer_items
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Business-metric-related

CREATE TRIGGER update_bd_fin_revenue_mtds_updated_at_trigger
  BEFORE UPDATE ON bd_fin_revenue_mtds
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bd_fin_cost_mtds_updated_at_trigger
  BEFORE UPDATE ON bd_fin_cost_mtds
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bd_north_star_indicators_updated_at_trigger
  BEFORE UPDATE ON bd_north_star_indicators
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bd_north_star_mtds_updated_at_trigger
  BEFORE UPDATE ON bd_north_star_mtds
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

-- Article-related

CREATE TRIGGER update_articles_updated_at_trigger
  BEFORE UPDATE ON articles
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Interstitial Ads

CREATE TRIGGER update_interstitial_ads_updated_at_trigger
  BEFORE UPDATE ON interstitial_ads
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- WhatsApp-chat-related

CREATE TRIGGER update_wa_conversations_updated_at_trigger
  BEFORE UPDATE ON wa_conversations
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wa_chats_updated_at_trigger
  BEFORE UPDATE ON wa_chats
  FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Supabase Realtime

CREATE TRIGGER broadcast_wa_convs_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON wa_chats
  FOR EACH ROW
    EXECUTE FUNCTION wa_convs_change();

CREATE TRIGGER broadcast_wa_chats_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON wa_chats
  FOR EACH ROW
    EXECUTE FUNCTION wa_chats_change();

------------------
-- Unique Index --
------------------

-- LMS-related

CREATE UNIQUE INDEX idx_submissions_unique_per_project ON submissions (project_id, submitter_id);

-- Transaction-related

CREATE UNIQUE INDEX idx_discounts_unique_combination ON discounts (code, category, item_id);

-- Tickers

CREATE UNIQUE INDEX one_row_only ON ticker ((TRUE));

-- Interstitial Ads

CREATE UNIQUE INDEX interstitial_ads_one_row_only ON interstitial_ads ((TRUE));

--------------------------------
-- Other Table Configurations --
--------------------------------

-- Article-related

ALTER SEQUENCE articles_id_seq RESTART WITH 77777;

--------------
-- Policies --
--------------

-- Supabase Realtime

CREATE POLICY "Anon users can receive broadcasts for WhatsApp conv changes"
  ON realtime.messages
  FOR SELECT
  TO public
  USING (
    (SELECT realtime.topic()) = 'wa_convs_change'
  );

CREATE POLICY "Anon users can receive broadcasts for WhatsApp chat changes"
  ON realtime.messages
  FOR SELECT
  TO public
  USING (
    (SELECT realtime.topic()) = 'wa_chats_change'
  );
