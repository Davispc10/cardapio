import { Router } from 'express'
import multer from 'multer'

import multerConfig from '@config/multer'
import BusinessController from '@controllers/BusinessController'
import CategoryController from '@controllers/CategoryController'
import FileController from '@controllers/FileController'
import ProductController from '@controllers/ProductController'
import SegmentController from '@controllers/SegmentController'
import SessionController from '@controllers/SessionControler'
import UserController from '@controllers/UserController'
import validateBusinessStore from '@validators/BusinessStore'
import validateBusinessUpdate from '@validators/BusinessUpdate'
import validateCategoryStore from '@validators/CategoryStore'
import validateCategoryUpdate from '@validators/CategoryUpdate'
import validateProductStore from '@validators/ProductStore'
import validateProductUpdate from '@validators/ProductUpdate'
import validateSegmentStore from '@validators/SegmentStore'
import validateSessionStore from '@validators/SessionStore'
import validateUserStore from '@validators/UserStore'
import validateUserUpdate from '@validators/UserUpdate'

import authMiddleware from './app/middlewares/auth'

const routes = Router()
const upload = multer(multerConfig)

routes.post('/users', validateUserStore, UserController.store)
routes.post('/sessions', validateSessionStore, SessionController.store)

routes.use(authMiddleware)

routes.put('/users', validateUserUpdate, UserController.update)
routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/segments', SegmentController.index)
routes.post('/segments', validateSegmentStore, SegmentController.store)

routes.get('/business', BusinessController.index)
routes.get('/business/:id', BusinessController.show)
routes.post('/business', upload.single('image'), validateBusinessStore, BusinessController.store)
routes.put('/business/:id', upload.single('image'), validateBusinessUpdate, BusinessController.update)

routes.post('/business/:businessId/categories', validateCategoryStore, CategoryController.store)
routes.put('/business/:businessId/categories/:id', validateCategoryUpdate, CategoryController.update)
routes.get('/business/:businessId/categories', CategoryController.index)
routes.get('/business/:businessId/categories/:id', CategoryController.show)
routes.delete('/business/:businessId/categories/:id', CategoryController.delete)

routes.post('/business/:businessId/products', upload.single('image'), validateProductStore, ProductController.store)
routes.put('/business/:businessId/products/:id', upload.single('image'), validateProductUpdate, ProductController.update)
routes.get('/business/:businessId/products', ProductController.index)
routes.get('/business/:businessId/products/:id', ProductController.show)
routes.delete('/business/:businessId/products/:id', ProductController.delete)

export default routes
