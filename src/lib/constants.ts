export const APP_LINKS = {
  github: "https://github.com/baditaflorin/numen",
  paypal: "https://www.paypal.com/paypalme/florinbadita",
  pages: "https://baditaflorin.github.io/numen/",
} as const;

export const BUILD_INFO = {
  version: __APP_VERSION__,
  commit: __GIT_COMMIT__,
  builtAt: __BUILD_TIME__,
} as const;
