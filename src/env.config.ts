const environmentVariables = process.env;

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = environmentVariables;

export default {
  SEND_GRID_KEY: process.env.SEND_GRID_KEY ?? '',
  EMAIL_FROM: process.env.EMAIL_FROM ?? '',
  DB: {
    HOST: DB_HOST ?? '',
    PORT: DB_PORT ?? 0,
    NAME: DB_NAME ?? '',
    USERNAME: DB_USERNAME ?? '',
    PASSWORD: DB_PASSWORD ?? '',
  },
};
