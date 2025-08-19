// Validation schema for the event creation/update
import z from "zod";

export const ticketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  price: z.number().min(0, "Price must be >= 0"),
  quantity: z.number().min(1, "At least 1 ticket required"),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startsAt: z.string().min(1, "Start date is required"),
  location: z.string().optional(),
  capacity: z.number().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled"]),
  tickets: z.array(ticketSchema).min(1, "At least one ticket required"),
});

export type EventFormValues = z.infer<typeof eventSchema>;
