import type {SelectUser} from "../db/schema";
import jwt from 'jsonwebtoken'
import { UserPayload } from '../models'

export function generateToken (usuario: SelectUser, expiresIn: number = 1, secret: string = process.env.JWT_SECRET || 'aksdfjñkasjdfñklasd'): string {
  const payload: UserPayload = {
    id: usuario.id,
    name: usuario.name,
    email: usuario.email
  }

  return jwt.sign(payload, secret, {
    expiresIn: `${expiresIn}h`,
    subject: usuario.name,
    algorithm: 'HS256'
  })
}

