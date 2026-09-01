export function getAppUrl() {
  const appUrl =
    process.env.APP_URL;

  if (!appUrl) {
    throw new Error(
      "Missing APP_URL."
    );
  }

  return appUrl.replace(
    /\/+$/,
    ""
  );
}