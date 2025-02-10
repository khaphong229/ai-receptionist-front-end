import { SuccessResponse } from '@/types/utils.type'
import { loginBody } from '@/validations/auth.validation'
import { z } from 'zod'

export type loginBodyType = z.infer<typeof loginBody>

export type AuthResponse = SuccessResponse<{
  access_token: string
  expire_in: number
  auth_type: string
}>
