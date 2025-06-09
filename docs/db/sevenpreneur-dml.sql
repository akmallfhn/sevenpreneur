-- PostgreSQL Database for Sevenpreneur

---------------
-- Time Zone --
---------------

SET TIMEZONE = 'Asia/Jakarta'; -- For these queries in this transaction

----------------
-- Industries --
----------------

INSERT INTO industries (industry_name, created_at) VALUES
  ('Agriculture',                  '2025-05-27 09:00:00+07:00'),
  ('Automotive',                   '2025-05-27 09:00:00+07:00'),
  ('Biotechnology',                '2025-05-27 09:00:00+07:00'),
  ('Chemicals',                    '2025-05-27 09:00:00+07:00'),
  ('Construction',                 '2025-05-27 09:00:00+07:00'),
  ('Consulting',                   '2025-05-27 09:00:00+07:00'),
  ('Consumer Goods',               '2025-05-27 09:00:00+07:00'),
  ('Education',                    '2025-05-27 09:00:00+07:00'),
  ('Energy',                       '2025-05-27 09:00:00+07:00'),
  ('Engineering',                  '2025-05-27 09:00:00+07:00'),
  ('Entertainment',                '2025-05-27 09:00:00+07:00'),
  ('Environmental Services',       '2025-05-27 09:00:00+07:00'),
  ('Fashion',                      '2025-05-27 09:00:00+07:00'),
  ('Financial Services',           '2025-05-27 09:00:00+07:00'),
  ('Food and Beverage',            '2025-05-27 09:00:00+07:00'),
  ('Government',                   '2025-05-27 09:00:00+07:00'),
  ('Healthcare',                   '2025-05-27 09:00:00+07:00'),
  ('Hospitality',                  '2025-05-27 09:00:00+07:00'),
  ('Human Resources',              '2025-05-27 09:00:00+07:00'),
  ('Information Technology',       '2025-05-27 09:00:00+07:00'),
  ('Insurance',                    '2025-05-27 09:00:00+07:00'),
  ('Legal',                        '2025-05-27 09:00:00+07:00'),
  ('Logistics and Transportation', '2025-05-27 09:00:00+07:00'),
  ('Manufacturing',                '2025-05-27 09:00:00+07:00'),
  ('Media',                        '2025-05-27 09:00:00+07:00'),
  ('Mining',                       '2025-05-27 09:00:00+07:00'),
  ('Non Profit',                   '2025-05-27 09:00:00+07:00'),
  ('Pharmaceuticals',              '2025-05-27 09:00:00+07:00'),
  ('Public Relations',             '2025-05-27 09:00:00+07:00'),
  ('Real Estate',                  '2025-05-27 09:00:00+07:00'),
  ('Retail',                       '2025-05-27 09:00:00+07:00'),
  ('Telecommunications',           '2025-05-27 09:00:00+07:00'),
  ('Textiles',                     '2025-05-27 09:00:00+07:00'),
  ('Tourism',                      '2025-05-27 09:00:00+07:00'),
  ('Utilities',                    '2025-05-27 09:00:00+07:00');

------------------------
-- Entrepreneur Stage --
------------------------

INSERT INTO entrepreneur_stages (stage_name, created_at) VALUES
  ('Ideation',             '2025-05-27 09:00:00+07:00'),
  ('Feasibility Analysis', '2025-05-27 09:00:00+07:00'),
  ('Business Planning',    '2025-05-27 09:00:00+07:00'),
  ('Execution',            '2025-05-27 09:00:00+07:00'),
  ('Growth',               '2025-05-27 09:00:00+07:00');

-----------
-- Roles --
-----------

-- The permission column can store at most 15 features (SMALLINT).
-- If more features are needed, we need to change its data type.

INSERT INTO roles VALUES (
  /* id         */ 0,
  /* name       */ 'Administrator',
  /* permission */ 32767, -- bit: 0111 1111 1111 1111
  /* created_at */ '2025-05-27 09:00:00+07:00',
  /* updated_at */ '2025-05-27 09:00:00+07:00'
);
INSERT INTO roles (name, permission, created_at, updated_at)
VALUES (
  /* id            1 (automatic) */
  /* name       */ 'Educator',
  /* permission */ 255, -- bit: 0000 0000 1111 1111
  /* created_at */ '2025-05-27 09:00:00+07:00',
  /* updated_at */ '2025-05-27 09:00:00+07:00'
), (
  /* id            2 (automatic) */
  /* name       */ 'Class Manager',
  /* permission */ 63, -- bit: 0000 0000 0011 1111
  /* created_at */ '2025-05-27 09:00:00+07:00',
  /* updated_at */ '2025-05-27 09:00:00+07:00'
), (
  /* id            3 (automatic) */
  /* name       */ 'General User',
  /* permission */ 7, -- bit: 0000 0000 0000 0111
  /* created_at */ '2025-05-27 09:00:00+07:00',
  /* updated_at */ '2025-05-27 09:00:00+07:00'
);
