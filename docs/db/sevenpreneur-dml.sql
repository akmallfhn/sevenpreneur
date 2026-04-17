-- PostgreSQL Database for Sevenpreneur

---------------
-- Time Zone --
---------------

SET TIMEZONE = 'Asia/Jakarta'; -- For these queries in this transaction

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
  /* id            4 (automatic) */
  /* name       */ 'Marketer',
  /* permission */ 31, -- bit: 0000 0000 0001 1111
  /* created_at */ '2025-12-31 12:00:00+07:00',
  /* updated_at */ '2025-12-31 12:00:00+07:00'
), (
  /* id            3 (automatic) */
  /* name       */ 'General User',
  /* permission */ 7, -- bit: 0000 0000 0000 0111
  /* created_at */ '2025-05-27 09:00:00+07:00',
  /* updated_at */ '2025-05-27 09:00:00+07:00'
);

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

-----------------------------
-- Telephone Country Codes --
-----------------------------

-- This list is sorted by its GDP (nominal), except Indonesia.

INSERT INTO phone_country_codes (country_name, phone_code, emoji) VALUES
  ('Indonesia',            '62' , '🇮🇩'),
  ('North America',        '1'  , '🇺🇸'),
  ('China',                '86' , '🇨🇳'),
  ('Germany',              '49' , '🇩🇪'),
  ('India',                '91' , '🇮🇳'),
  ('Japan',                '81' , '🇯🇵'),
  ('United Kingdom',       '44' , '🇬🇧'),
  ('France',               '33' , '🇫🇷'),
  ('Italy',                '39' , '🇮🇹'),
  ('Brazil',               '55' , '🇧🇷'),
  ('Russia/Kazakhstan',    '7'  , '🇷🇺'),
  ('Spain',                '34' , '🇪🇸'),
  ('South Korea',          '82' , '🇰🇷'),
  ('Australia',            '61' , '🇦🇺'),
  ('Mexico',               '52' , '🇲🇽'),
  ('Turkey',               '90' , '🇹🇷'),
  ('Netherlands',          '31' , '🇳🇱'),
  ('Saudi Arabia',         '966', '🇸🇦'),
  ('Poland',               '48' , '🇵🇱'),
  ('Switzerland',          '41' , '🇨🇭'),
  ('Taiwan',               '886', '🇹🇼'),
  ('Belgium',              '32' , '🇧🇪'),
  ('Argentina',            '54' , '🇦🇷'),
  ('Sweden',               '46' , '🇸🇪'),
  ('Ireland',              '353', '🇮🇪'),
  ('Singapore',            '65' , '🇸🇬'),
  ('United Arab Emirates', '971', '🇦🇪'),
  ('Thailand',             '66' , '🇹🇭'),
  ('Austria',              '43' , '🇦🇹'),
  ('Norway',               '47' , '🇳🇴'),
  ('Philippines',          '63' , '🇵🇭'),
  ('Vietnam',              '84' , '🇻🇳'),
  ('Bangladesh',           '880', '🇧🇩'),
  ('Malaysia',             '60' , '🇲🇾'),
  ('Denmark',              '45' , '🇩🇰'),
  ('Iran',                 '98' , '🇮🇷'),
  ('Colombia',             '57' , '🇨🇴'),
  ('Hong Kong',            '852', '🇭🇰'),
  ('South Africa',         '27' , '🇿🇦'),
  ('Romania',              '40' , '🇷🇴'),
  ('Czech Republic',       '420', '🇨🇿'),
  ('Egypt',                '20' , '🇪🇬'),
  ('Chile',                '56' , '🇨🇱'),
  ('Pakistan',             '92' , '🇵🇰'),
  ('Portugal',             '351', '🇵🇹'),
  ('Finland',              '358', '🇫🇮'),
  ('Peru',                 '51' , '🇵🇪'),
  ('Algeria',              '213', '🇩🇿'),
  ('Greece',               '30' , '🇬🇷'),
  ('Iraq',                 '964', '🇮🇶'),
  ('New Zealand',          '64' , '🇳🇿'),
  ('Hungary',              '36' , '🇭🇺'),
  ('Qatar',                '974', '🇶🇦'),
  ('Ukraine',              '380', '🇺🇦'),
  ('Nigeria',              '234', '🇳🇬'),
  ('Morocco',              '212', '🇲🇦'),
  ('Kuwait',               '965', '🇰🇼'),
  ('Cuba',                 '53' , '🇨🇺'),
  ('Slovakia',             '421', '🇸🇰'),
  ('Uzbekistan',           '998', '🇺🇿'),
  ('Kenya',                '254', '🇰🇪'),
  ('Ecuador',              '593', '🇪🇨'),
  ('Guatemala',            '502', '🇬🇹'),
  ('Ethiopia',             '251', '🇪🇹'),
  ('Bulgaria',             '359', '🇧🇬'),
  ('Angola',               '244', '🇦🇴'),
  ('Venezuela',            '58' , '🇻🇪'),
  ('Oman',                 '968', '🇴🇲'),
  ('Costa Rica',           '506', '🇨🇷'),
  ('Croatia',              '385', '🇭🇷'),
  ('Luxembourg',           '352', '🇱🇺'),
  ('Ivory Coast',          '225', '🇨🇮'),
  ('Serbia',               '381', '🇷🇸'),
  ('Panama',               '507', '🇵🇦'),
  ('Lithuania',            '370', '🇱🇹'),
  ('Turkmenistan',         '993', '🇹🇲'),
  ('Ghana',                '233', '🇬🇭'),
  ('Tanzania',             '255', '🇹🇿'),
  ('Sri Lanka',            '94' , '🇱🇰'),
  ('Uruguay',              '598', '🇺🇾'),
  ('DR Congo',             '243', '🇨🇩'),
  ('Azerbaijan',           '994', '🇦🇿'),
  ('Slovenia',             '386', '🇸🇮'),
  ('Belarus',              '375', '🇧🇾'),
  ('Myanmar',              '95' , '🇲🇲'),
  ('Uganda',               '256', '🇺🇬'),
  ('Bolivia',              '591', '🇧🇴'),
  ('Tunisia',              '216', '🇹🇳'),
  ('Jordan',               '962', '🇯🇴'),
  ('Cameroon',             '237', '🇨🇲'),
  ('Macau',                '853', '🇲🇴'),
  ('Cambodia',             '855', '🇰🇭'),
  ('Bahrain',              '973', '🇧🇭'),
  ('Libya',                '218', '🇱🇾'),
  ('Nepal',                '977', '🇳🇵');

----------------------
-- Payment Channels --
----------------------

-- https://archive.developers.xendit.co/api-reference/#create-invoice
-- https://dashboard.xendit.co/settings/billings#fee-structure
INSERT INTO payment_channels (id, label, code, method, image, status, calc_percent, calc_flat, calc_vat) VALUES
  -- Bank Transfer (Virtual Account)
  (2,  'BRI Virtual Account',               'BRI',               'BANK_TRANSFER', '', 'active',   0.00, 4000., TRUE ),
  (3,  'BNI Virtual Account',               'BNI',               'BANK_TRANSFER', '', 'active',   0.00, 4000., TRUE ),
  (4,  'Mandiri Virtual Account',           'MANDIRI',           'BANK_TRANSFER', '', 'active',   0.00, 4000., TRUE ),
  (7,  'BSI Virtual Account',               'BSI',               'BANK_TRANSFER', '', 'active',   0.00, 4000., TRUE ),
  (8,  'Permata Bank Virtual Account',      'PERMATA',           'BANK_TRANSFER', '', 'active',   0.00, 4000., TRUE ),
  (19, 'CIMB Niaga Virtual Account',        'CIMB',              'BANK_TRANSFER', '', 'active',   0.00, 4000., TRUE ),
  -- E-wallet
  (13, 'Link Aja',                          'LINKAJA',           'EWALLET',       '', 'active',   1.50,    0., TRUE ),
  (15, 'AstraPay',                          'ASTRAPAY',          'EWALLET',       '', 'active',   1.50,    0., TRUE ),
  -- QR Code
  (14, 'QRIS',                              'QRIS',              'QR_CODE',       '', 'active',   0.70,    0., FALSE),
  -- Paylater/Debt
  (17, 'Akulaku',                           'AKULAKU',           'PAYLATER',      '', 'active',   1.70,    0., TRUE ),
  -- Credit Card
  (18, 'Credit Card',                       'CREDIT_CARD',       'CREDIT_CARD',   '', 'active',   2.90, 2000., TRUE ),
  -- Inactive channels
  (1,  'BCA Virtual Account',               'BCA',               'BANK_TRANSFER', '', 'inactive', 0.00, 4000., TRUE ),
  (5,  'Neobank Virtual Account',           'BNC',               'BANK_TRANSFER', '', 'inactive', 0.00, 4000., TRUE ),
  (6,  'Sahabat Sampoerna Virtual Account', 'SAHABAT_SAMPOERNA', 'BANK_TRANSFER', '', 'inactive', 0.00, 4000., TRUE ),
  (9,  'DANA',                              'DANA',              'EWALLET',       '', 'inactive', 1.50,    0., TRUE ),
  (10, 'Jenius Pay',                        'JENIUSPAY',         'EWALLET',       '', 'inactive', 2.00,    0., TRUE ),
  (11, 'OVO',                               'OVO',               'EWALLET',       '', 'inactive', 2.73,    0., TRUE ),
  (12, 'ShopeePay',                         'SHOPEEPAY',         'EWALLET',       '', 'inactive', 4.00,    0., FALSE);

ALTER SEQUENCE payment_channels_id_seq RESTART WITH 19;
