// Validation schema for the event creation/update
import z from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startsAt: z.string().min(1, "Start date is required"),
  location: z.string().optional(),
  capacity: z.number().optional(),
  price: z.number().min(0, "Price can't be negative value"),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled"]),
});

export type EventFormValues = z.infer<typeof eventSchema>;
