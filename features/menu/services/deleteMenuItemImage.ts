import { cloudinary } from "@/lib/cloudinary";

export async function deleteMenuItemImage(
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