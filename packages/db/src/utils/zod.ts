/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { type z } from "zod";

/**
 * Helper function to allow us to wrap core database updates with zod validation
 */
export function zod<Schema extends z.ZodSchema<any, any, any>, Return>(
  schema: Schema,
  func: (value: z.infer<Schema>) => Return,
) {
  const result = (input: z.infer<Schema>) => {
    const parsed = schema.parse(input);
    return func(parsed);
  };
  result.schema = schema;
  return result;
}
