import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  content: z.string().min(10, "Tell us a bit more (10+ characters)"),
  type: z.enum(["BUG", "FIX", "IDEA"]),
  gameId: z
    .number({ error: "Pick a game" })
    .int()
    .positive("Pick a game"),
  platformIds: z
    .array(z.number().int().positive())
    .min(1, "Select at least one platform"),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
