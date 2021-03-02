import {
  RequestHandler, Request, Response, NextFunction
} from 'express';
import Joi from '@hapi/joi';
import definition from '../middleware/openapi-definitions';

interface HandlerOptions {
  params?: Joi.ObjectSchema<any>,
  query?: Joi.ObjectSchema<any>,
  body?: Joi.ObjectSchema<any>
};

export const docMiddleware = (
  handler: RequestHandler,
  options?: HandlerOptions,
) => {
  // eslint-disable-next-line no-console
  console.log('doc middleware ', handler);
};

export default docMiddleware;
