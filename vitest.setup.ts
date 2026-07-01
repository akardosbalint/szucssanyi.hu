process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://szucssanyi:szucssanyi_dev@localhost:5432/szucssanyi_test?schema=public";
