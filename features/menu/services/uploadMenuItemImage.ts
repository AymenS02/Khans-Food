import type {
  UploadApiResponse,
} from "cloudinary";

import { cloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

export interface UploadedMenuImage {
  url: string;
  publicId: string;
}

export class MenuImageUploadError extends Error {
  constructor(
    message: string
  ) {
    super(message);

    this.name =
      "MenuImageUploadError";
  }
}

export async function uploadMenuItemImage(
  file: File
): Promise<UploadedMenuImage> {
  /*
   * ==========================================
   * 1. EMPTY FILE
   * ==========================================
   */

  if (
    !file ||
    file.size === 0
  ) {
    throw new MenuImageUploadError(
      "Please choose an image."
    );
  }

  /*
   * ==========================================
   * 2. FILE SIZE
   * ==========================================
   */

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new MenuImageUploadError(
      "Image must be 5 MB or smaller."
    );
  }

  /*
   * ==========================================
   * 3. MIME TYPE
   * ==========================================
   */

  if (
    !ALLOWED_TYPES.has(
      file.type
    )
  ) {
    throw new MenuImageUploadError(
      "Image must be JPEG, PNG, or WebP."
    );
  }

  /*
   * ==========================================
   * 4. Convert browser File → Buffer
   * ==========================================
   */

  console.log("UPLOAD FILE:", {
  name: file.name,
  type: file.type,
  size: file.size,
});

  const arrayBuffer =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(
      arrayBuffer
    );

  /*
   * ==========================================
   * 5. Upload
   * ==========================================
   */

  const result =
    await new Promise<UploadApiResponse>(
      (
        resolve,
        reject
      ) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              resource_type:
                "image",

              folder:
                "khans-food/menu-items",
            },

            (
              error,
              result
            ) => {
              if (
                error ||
                !result
              ) {
                reject(
                  error ??
                    new Error(
                      "Cloudinary upload failed."
                    )
                );

                return;
              }

              resolve(
                result
              );
            }
          );

        uploadStream.end(
          buffer
        );
      }
    );

  if (
    !result.secure_url ||
    !result.public_id
  ) {
    throw new Error(
      "Cloudinary returned an invalid upload response."
    );
  }

  return {
    url:
      result.secure_url,

    publicId:
      result.public_id,
  };
}