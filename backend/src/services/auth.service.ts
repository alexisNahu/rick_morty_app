import { LoginSchemaType, RegisterSchemaType } from '../zod_schemas/auth.schemas'
import {ApiError, BadRequestError, ConflictError, ForbiddenError, handleError, UnauthorizedError} from '../apiErrores'
import { SelectUser } from '../db/schema'
import * as userRepo from '../repositories/users.repository'
import { compare, hash } from 'bcrypt'
import { generateToken } from './jwt.service'
import 'dotenv/config'

export async function login ({email, password}: LoginSchemaType) {
  try {
    const foundUser: SelectUser | undefined = (await userRepo.selectUsers({email}))[0]
    if (!foundUser) throw new UnauthorizedError('Username or Password wrong')

    const passwordValidation: boolean = await compare(password, foundUser.passwordHash)
    if (!passwordValidation) throw new UnauthorizedError('Username or Password wrong')

    const accessToken: string = generateToken(foundUser, 900, process.env.JWT_SECRET)
    const refreshToken: string = generateToken(foundUser, 1800, process.env.REFRESH_TOKEN)

    return {accessToken, refreshToken, foundUser}
  } catch(e: any) {
    handleError(e as ApiError);
    throw e
  }
}


export async function register({name, password, email, repeat_password}: RegisterSchemaType): Promise<SelectUser> {
  try {
    if (password !== repeat_password) throw new BadRequestError(`Passwords doesnt match ${password}, ${repeat_password}`)

    const existsEmail: boolean = await userRepo.existsEmail(email)
    if (existsEmail) throw new ConflictError(`Email ${email} already registered`)

    const passwordHash: string = await hash(password, 10)

    return await userRepo.createUser({
      name,
      passwordHash,
      email
    })
  } catch (e: any) {
    handleError(e as ApiError); throw e
  }
}
