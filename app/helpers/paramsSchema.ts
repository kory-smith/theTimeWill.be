import { z } from "zod";

export const ParamsSchema = z.object({
  target: z.number(),
  unit: z.enum(["second", "seconds", "minute", "minutes", "hour", "hours"]),
  adjective: z.enum(["before", "after"]),
  source: z.string(),
  meridiem: z.enum(["am", "pm"]).optional(),
});