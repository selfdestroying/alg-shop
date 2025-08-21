import z from 'zod/v4';

export const signInFormSchema = z.object({
  login: z.string(),
  password: z.string(),
});
