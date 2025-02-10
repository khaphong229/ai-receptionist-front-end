import { z } from 'zod'

export const loginBody = z.object({
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255)
})
