import withPWA from "next-pwa";

const config = {
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  sw: "service-worker.js",
};

const withPWAConfig = withPWA(config);

export default {
  ...withPWAConfig,
  reactStrictMode: false,
};
