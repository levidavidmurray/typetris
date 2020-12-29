export const Config = {
  api: {
    PROD: "https://api.typetris.com",
    DEV: "http://localhost:5000",
  },
  isDev: process.env.NODE_ENV === "development",
};
