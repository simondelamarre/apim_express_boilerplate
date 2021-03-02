import {
  RequestHandler, Request, Response, NextFunction
} from 'express';

interface HandlerOptions {
  scopes?: string[]
  rights?: string[]
};

/**
* This router wrapper catches any error from async await
* and throws it to the default express error handler,
* instead of crashing the app
* @param handler Request handler to check for error
*/
export const bigeMiddleware = (
  handler: RequestHandler,
  options?: HandlerOptions,
): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.log('bige middleware ', options);
  // TODO check and get setups from request headers bige-api-key bige-apim-key bige-public-key
  return handler(req, res, next);
  // next();
};

export default bigeMiddleware;
