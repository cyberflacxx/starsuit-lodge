import "server-only";

export async function uploadGalleryImage(file: File, path: string) {
  void file;
  void path;

  return {
    success: false,
    skipped: true,
    message:
      "Supabase Storage upload is not configured in this module yet. Use the image URL field for now.",
    imageUrl: null as string | null,
  };
}
