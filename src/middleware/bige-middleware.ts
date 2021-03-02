/* eslint-disable no-mixed-operators */
import {
  RequestHandler, Request, Response, NextFunction
} from 'express';

const JWT = require('jsonwebtoken');

interface HandlerOptions {
  keyName: string;
  scopes?: string[];
  rights?: string[];
  operator?: string;
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
): RequestHandler => async (request: Request, res: Response, next: NextFunction) => {
  // TODO check and get setups from request headers bige-api-key bige-apim-key bige-public-key
  try {
    const token = request.headers[options.keyName];
    const decrypt = JWT.verify(token, process.env.BIGE_SECRET);
    if (!options.operator || options.operator === 'matchAll') {
      if (options.scopes) {
        // eslint-disable-next-line no-restricted-syntax
        for (const scope of options.scopes) {
          if (!decrypt.scopes.includes(scope)) {
            throw new Error(`unauthorized by request access scope ${scope}`);
          }
        }
      }
      if (options.rights) {
        // eslint-disable-next-line no-restricted-syntax
        for (const right of options.scopes) {
          if (!decrypt.rights.includes(right)) {
            throw new Error(`unauthorized by request access rights ${right}`);
          }
        }
      }
    } else if (options.operator === 'oneOf') {
      // eslint-disable-next-line max-len
      if (
        options.scopes && !decrypt.scopes
        || !decrypt.scopes.some((scope: any) => options.scopes.includes(scope))
      ) {
        throw new Error(`unauthorized by request access scopes ${options.scopes}`);
      }
      // eslint-disable-next-line max-len
      if (
        options.rights && !decrypt.rights
        || !decrypt.rights.some((right: any) => options.rights.includes(right))
      ) {
        throw new Error(`unauthorized by request access scopes ${options.scopes}`);
      }
    }
    if (decrypt) {
      // eslint-disable-next-line default-case
      switch (options.keyName) {
        case 'bige-api-key':
          request.params.buser = decrypt;
          break;
        case 'bige-app-key':
          request.params.bapp = decrypt;
          break;
        case 'bige-public-key':
          request.params.bpub = decrypt;
          break;
        case 'bige-apim-key':
          request.params.bapi = decrypt;
          break;
      }
      return handler(request, res, next);
    }
    throw new Error(`UNAUTHORIZED - by ${options.keyName} authorization header`);
  } catch (err) {
    throw new Error(`UNAUTHORIZED - by bige keyName ${options.keyName} key ${request.headers[options.keyName]}`);
  }
};

export default bigeMiddleware;
