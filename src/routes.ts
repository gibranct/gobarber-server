import multer from 'multer';
import { Router } from 'express';

import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import ScheduleController from './app/controllers/ScheduleController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/appointments', AppointmentController.index);

routes.post('/appointments', AppointmentController.store);

routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/providers', ProviderController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.put('/users', UserController.update);

routes.get('/notifications', NotificationController.index);

routes.put('/notifications/:id', NotificationController.update);

export default routes;
