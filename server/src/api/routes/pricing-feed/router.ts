import express from 'express';
import controller from './pricing-feed-controller';

export default express
    .Router()
    .post('/', controller.create)
    .put('/', controller.update)
    .get('/', controller.search)
