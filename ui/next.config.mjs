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
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: "url-loader",
      },
    });
    return config;
  },
};
