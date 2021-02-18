export const isProd = () => process.env.NODE_ENV === "production";

// @ts-expect-error
export const isCypress = () => window && window.Cypress;
