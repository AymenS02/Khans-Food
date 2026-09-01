export function getAppUrl() {
  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error(
      "Missing APP_URL."
    );
  }

  const normalizedAppUrl = appUrl
    .trim()
    .replace(/\/+$/, "");

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(
      normalizedAppUrl
    );
  } catch {
    throw new Error(
      "APP_URL must be a valid absolute URL."
    );
  }

  if (
    process.env.NODE_ENV ===
      "production" &&
    (parsedUrl.hostname ===
      "localhost" ||
      parsedUrl.hostname ===
        "127.0.0.1")
  ) {
    throw new Error(
      "APP_URL cannot use localhost in production."
    );
  }

  return normalizedAppUrl;
}