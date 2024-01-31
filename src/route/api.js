import express from "express";
import userController from "../controller/user-controller.js";
import contactController from "../controller/contact-controller.js";
import addressController from "../controller/address-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import authController from "../controller/auth-controller.js";

const Router = new express.Router();

// Auth API
Router.post('/api/auth/register', authController.register);
Router.post('/api/auth/login', authController.login);
Router.post('/api/auth/forgot-password', authController.forgotPassword);
Router.post('/api/auth/check-otp', authController.checkOtp);
Router.post('/api/auth/reset-password', authController.resetPassword);

Router.use(authMiddleware);
// User API
Router.get('/api/users/current', userController.get);
Router.patch('/api/users/current', userController.update);
Router.delete('/api/auth/logout', authController.logout);

// Contact API
Router.post('/api/contacts', contactController.create);
Router.get('/api/contacts/:contactId', contactController.get);
Router.put('/api/contacts/:contactId', contactController.update);
Router.delete('/api/contacts/:contactId', contactController.remove);
Router.get('/api/contacts', contactController.search);

// Address API
Router.post('/api/contacts/:contactId/addresses', addressController.create);
Router.get('/api/contacts/:contactId/addresses/:addressId', addressController.get);
Router.put('/api/contacts/:contactId/addresses/:addressId', addressController.update);
Router.delete('/api/contacts/:contactId/addresses/:addressId', addressController.remove);
Router.get('/api/contacts/:contactId/addresses', addressController.list);

export {
    Router
}
