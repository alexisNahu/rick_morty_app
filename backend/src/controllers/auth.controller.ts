import type {Response, Request} from "express";
import * as authService from '../services/auth.service'
import {ApiError} from "../apiErrores";
import jwt from "jsonwebtoken";
import { SelectUser } from '../db/schema'
import {config} from "../config/config";

export const authController = {
  register: async (req: Request, res: Response)=> {
    process.stdout.write('Esto sale sí o sí\n'); // Escritura directa al sistema

    try {
      const {
        name,
        password,
        email,
        repeat_password
      } = req.body
      const newUser: SelectUser = await authService.register({name, password, email, repeat_password})

      return res.status(200).json({msg: 'usuario en el sistema registrado correctamente', details: newUser})
    } catch(e: any) {
      return res.status(e instanceof ApiError ? e.statusCode : 500).json({msg: 'error registrado al nuevo usuario', details: e.message})
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const {
        email,
        password
      } = req.body

      const {accessToken, refreshToken, foundUser} = await authService.login({email, password})


      res
        .cookie('access_token', accessToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 7000 * 60 * 60
        })
      return res.status(200).json({msg: 'usuario logeado correctamente', details: {accessToken, refreshToken}})
    } catch (e: any) {
      return res.status(e instanceof ApiError ? e.statusCode : 500).json({msg: 'error logeando al nuevo usuario', details: e.message})
    }
  },
  logout: async (req: Request, res: Response) =>  {
    try {

      res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'strict'
      })
      res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'strict'
      })

      res.status(200).json({msg: 'Logout succesfull'})
    } catch (e:any) {
      res.status(400).json({msg: 'Something went wrong', details: e.message})
    }
  },
  me: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.access_token;
      const decoded = jwt.verify(token, config.jwt.secret);
      res.status(200).json({msg: 'User info fetched', details: decoded});
    } catch (e: any) {
      res.status(401).json({msg: 'Something went wrong at me/', details: e.message});
    }
  }
}
