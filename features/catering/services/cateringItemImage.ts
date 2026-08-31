import { cloudinary } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

export class CateringItemImageUploadError
  extends Error {
  constructor(message: string) {
    super(message);

    this.name =
      "CateringItemImageUploadError";
  }
}

export interface UploadedCateringItemImage {
  url: string;
  publicId: string;
}

export async function uploadCateringItemImage(
  file: File
): Promise<UploadedCateringItemImage> {
  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type
    )
  ) {
    throw new CateringItemImageUploadError(
      "Image must be JPEG, PNG, or WebP."
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    throw new CateringItemImageUploadError(
      "Image cannot exceed 5 MB."
    );
  }

  const arrayBuffer =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(
      arrayBuffer
    );

  return new Promise(
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
              "khans-food/catering-items",
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
                new Error(
                  error?.message ||
                    "Cloudinary upload failed."
                )
              );

              return;
            }

            resolve({
              url:
                result.secure_url,

              publicId:
                result.public_id,
            });
          }
        );

      uploadStream.end(
        buffer
      );
    }
  );
}

export async function deleteCateringItemImage(
  publicId: string
) {
  await cloudinary.uploader.destroy(
    publicId,
    {
      resource_type:
        "image",

      invalidate:
        true,
    }
  );
}