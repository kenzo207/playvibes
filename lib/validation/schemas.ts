import { z } from "zod";

// Comment validation
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be less than 500 characters")
    .trim(),
  playlistId: z.string().min(1, "Playlist ID is required"),
});

export type CommentInput = z.infer<typeof commentSchema>;

// Playlist validation
export const playlistSchema = z.object({
  spotifyPlaylistId: z.string().min(1, "Spotify playlist ID is required"),
  name: z
    .string()
    .min(1, "Playlist name is required")
    .max(200, "Playlist name must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  trackCount: z.number().int().min(0).default(0).optional(),
  genres: z.array(z.string()).max(10, "Maximum 10 genres allowed").optional(),
  moods: z.array(z.string()).max(10, "Maximum 10 moods allowed").optional(),
  activities: z.array(z.string()).max(10, "Maximum 10 activities allowed").optional(),
  isPublic: z.boolean().default(true),
});

export type PlaylistInput = z.infer<typeof playlistSchema>;

// Search params validation
export const searchParamsSchema = z.object({
  q: z.string().max(100, "Search query too long").optional(),
  genres: z.string().optional(),
  moods: z.string().optional(),
  activities: z.string().optional(),
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform((val) => Math.min(parseInt(val), 100))
    .optional(),
  sortBy: z.enum(["newest", "oldest", "most_liked", "most_saved"]).optional().default("newest"),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

// User profile update validation
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Generic ID validation
export const idSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Helper function to validate and parse data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Helper function for safe validation with error handling
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors = (error as any).errors;
      if (errors && errors.length > 0) {
        return {
          success: false,
          error: errors[0].message || "Validation failed",
        };
      }
      return { success: false, error: error.message || "Validation failed" };
    }
    return { success: false, error: "Invalid data" };
  }
}
