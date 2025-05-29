-- PostgreSQL Database for Sevenpreneur
-- USE sevenpreneur;

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
  /* name       */ 'Mentor',
  /* permission */ 15, -- bit: 0000 0000 0000 1111
  /* created_at */ '2025-05-27 09:00:00+07:00',
  /* updated_at */ '2025-05-27 09:00:00+07:00'
), (
  /* id            2 (automatic) */
  /* name       */ 'Mentee',
  /* permission */ 7, -- bit: 0000 0000 0000 0111
  /* created_at */ '2025-05-27 09:00:00+07:00',
  /* updated_at */ '2025-05-27 09:00:00+07:00'
);
