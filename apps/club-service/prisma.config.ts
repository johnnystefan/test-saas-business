import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env['CLUB_DATABASE_URL'],
  },
});
