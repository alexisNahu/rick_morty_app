import type {NextFunction, Request, Response} from "express";
import {type ZodObject, type ZodTypeAny} from "zod";
import {generateToken} from "../services/jwt.service";
import jwt from "jsonwebtoken";
import { UserPayload } from '../models'
import { SelectUser } from '../db/schema'
import * as userRepo from '../repositories/users.repository'
import { ApiError, UnauthorizedError } from '../apiErrores'

export type RequestSchema = ZodObject<{
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}>;

interface AuthResponse extends Response {
  tokenPayload?: UserPayload
}

export const validateSchema = <T extends RequestSchema>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!validation.success) {
      return res.status(400).json({
        msg: "Error de validación en la petición",
        details: validation.error.issues,
      });
    }

    // ✅ 1. Sincronizar el BODY (JSON enviado)
    // Zod ya aplicó transformaciones como z.coerce.date()
    if (validation.data.body) {
      req.body = validation.data.body;
    }

    // ✅ 2. Sincronizar PARAMS (El ID de la URL)
    // Usamos Object.assign para evitar el error de "only a getter"
    if (validation.data.params) {
      Object.assign(req.params, validation.data.params);
    }

    // ✅ 3. Sincronizar QUERY (Opcional)
    if (validation.data.query) {
      Object.assign(req.query, validation.data.query);
    }

    return next();
  };


export const validateToken = () => async (req: Request, res: AuthResponse, next: NextFunction) => {
  const access_token = req.cookies.access_token
  const refresh_token = req.cookies.refresh_token

  try {
    if (access_token) return next()


    if (!access_token && refresh_token) {
      const refreshTokenPayload: UserPayload = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN!
      ) as UserPayload;

      const usuario: SelectUser | undefined = (await userRepo.selectUsers({ id: refreshTokenPayload.id }))[0];
      if (!usuario) {
        throw new UnauthorizedError('El usuario del refresh token no existe');
      }

      const newAccessToken: string = generateToken(usuario);

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 // 1 hora
      });

      return next();
    }



    if (!access_token && !refresh_token) return res.status(400).send('Usuario no logeado o no autenticado')
  } catch (e: any) {
    console.error(e);
    return res.status(e instanceof ApiError ? e.statusCode : 500).json({msg: e.details})
  }
}
