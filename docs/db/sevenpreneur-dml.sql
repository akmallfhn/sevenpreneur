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

INSERT INTO payment_channels (label, code, method, image, calc_percent, calc_flat) VALUES
  ('BCA Virtual Account',        'BCA_VIRTUAL_ACCOUNT',     'VIRTUAL_ACCOUNT', '', 0.00, 4000.), -- https://docs.xendit.co/docs/bca-virtual-account
  ('BRI Virtual Account',        'BRI_VIRTUAL_ACCOUNT',     'VIRTUAL_ACCOUNT', '', 0.00, 4000.), -- https://docs.xendit.co/docs/bri-virtual-account
  ('BNI Virtual Account',        'BNI_VIRTUAL_ACCOUNT',     'VIRTUAL_ACCOUNT', '', 0.00, 4000.), -- https://docs.xendit.co/docs/bni-virtual-account
  ('CIMB Niaga Virtual Account', 'CIMB_VIRTUAL_ACCOUNT',    'VIRTUAL_ACCOUNT', '', 0.00, 4000.), -- https://docs.xendit.co/docs/available-payment-channels
  ('Mandiri Virtual Account',    'MANDIRI_VIRTUAL_ACCOUNT', 'VIRTUAL_ACCOUNT', '', 0.00, 4000.), -- https://docs.xendit.co/docs/mandiri-virtual-account
  ('DANA',                       'DANA',                    'EWALLET',         '', 1.50,    0.), -- https://docs.xendit.co/docs/dana
  ('OVO',                        'OVO',                     'EWALLET',         '', 2.73,    0.), -- https://docs.xendit.co/docs/ovo
  ('ShopeePay',                  'SHOPEEPAY',               'EWALLET',         '', 4.00,    0.), -- https://docs.xendit.co/docs/shopeepay-e-wallets-id
  ('QRIS',                       'QRIS',                    'QR_CODE',         '', 0.70,    0.); -- https://docs.xendit.co/docs/qris
