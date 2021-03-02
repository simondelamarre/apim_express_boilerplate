import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Book from '../../models/Book';

export const getBookIdSchema: Joi.ObjectSchema<any> = Joi.object().keys({
  id: Joi.number().required()
});

const getId: RequestHandler = async (req, res) => {
  const { id } = req.params;

  res.status(200).send({
    message: 'Saved',
    id
  });
};

export default requestMiddleware(getId, { validation: { params: getBookIdSchema } });
