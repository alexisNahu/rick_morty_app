import {Router} from "express";
import { validateSchema, validateToken } from '../middlewares/schemaValidation.middleware'
import { LoginSchema, RegisterSchema } from '../zod_schemas/auth.schemas'
import { authController } from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.route('/login').post(validateSchema(LoginSchema), authController.login)
authRouter.route('/register').post(validateSchema(RegisterSchema), authController.register)
authRouter.route('/logout').post(validateToken(), authController.logout)
authRouter.route('/me').get(authController.me)

export default authRouter
