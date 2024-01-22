import { z } from "zod";

import minimist from "minimist";

const ArgSchema = z.object({
  to: z.string(),
  from: z.string(),
  input: z.string(),
  output: z.string().optional(),
});

export const getArgs = () => ArgSchema.parse(minimist(Bun.argv.slice(2)));
