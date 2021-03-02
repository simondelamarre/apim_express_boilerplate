import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiSpec from '../openapi.json';
import bigeMiddleware from '../src/middleware/bige-middleware';
import * as BookController from './controllers/book';

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }'
};

const router = Router();

// Book routes
router.post('/book/add', bigeMiddleware(BookController.add, { scopes: ['user'] }));
router.get('/book/all', bigeMiddleware(BookController.all, { scopes: ['user'] }));
router.get('/book/:id', bigeMiddleware(BookController.getId, { scopes: ['user'] }));
router.get('/book/search', bigeMiddleware(BookController.search, { scopes: ['user'] }));
// eslint-disable-next-line no-console
console.log('apiSpec ', apiSpec);
router.get('/openapi', (req, res) => {
  // eslint-disable-next-line no-console
  console.log('open api request  ', apiSpec);
  res.json(apiSpec);
});

// Dev routes
if (process.env.NODE_ENV === 'development') {
  router.use('/dev/api-docs', swaggerUi.serve);
  router.get('/dev/api-docs', swaggerUi.setup(apiSpec, swaggerUiOptions));
}

export default router;
