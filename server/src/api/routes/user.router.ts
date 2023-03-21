import express from 'express';
import controller from '../controllers/user-controller';

export default express
    .Router()    
    .post('/all', controller.getAllUsers)
    .post('/', controller.create)
    .put('/', controller.update)
    .delete('/', controller.delete)
