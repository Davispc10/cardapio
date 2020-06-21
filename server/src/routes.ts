import { Router } from 'express'
import multer from 'multer'

import FileController from './app/controllers/FileController'
import SessionController from './app/controllers/SessionControler'
import UserController from './app/controllers/UserController'
import authMiddleware from './app/middlewares/auth'
import validateSessionStore from './app/validators/SessionStore'
import validateUserStore from './app/validators/UserStore'
import validateUserUpdate from './app/validators/UserUpdate'
import multerConfig from './config/multer'

const routes = Router()
const upload = multer(multerConfig)

routes.post('/users', validateUserStore, UserController.store)
routes.post('/sessions', validateSessionStore, SessionController.store)

routes.use(authMiddleware)

routes.put('/users', validateUserUpdate, UserController.update)
routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)

routes.post('/files', upload.single('file'), FileController.store)

export default routes
