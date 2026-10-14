import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long"),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
