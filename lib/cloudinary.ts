import {
  v2 as cloudinary,
} from "cloudinary";

const cloudName =
  process.env
    .CLOUDINARY_CLOUD_NAME;

const apiKey =
  process.env
    .CLOUDINARY_API_KEY;

const apiSecret =
  process.env
    .CLOUDINARY_API_SECRET;

if (
  !cloudName ||
  !apiKey ||
  !apiSecret
) {
  throw new Error(
    "Missing Cloudinary environment variables."
  );
}

console.log("CLOUDINARY CONFIG:", {
  cloudName,
  apiKey:
    apiKey
      ? `${apiKey.slice(0, 4)}...`
      : "MISSING",

  apiSecret:
    apiSecret
      ? "LOADED"
      : "MISSING",
});

cloudinary.config({
  cloud_name:
    cloudName,

  api_key:
    apiKey,

  api_secret:
    apiSecret,

  secure: true,
});

export { cloudinary };