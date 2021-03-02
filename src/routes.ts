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
router.post('/book/add', bigeMiddleware(BookController.add, {
  keyName: 'bige-api-key', // only connected user
  scopes: ['user', 'admin'], // scoped user and admin
  rights: ['ADMIN'], // with ADMIN access right from APIM
  operator: 'matchAll' // will match scopes user and admin and match rights as ADMIN.
}));
router.get('/book/all', bigeMiddleware(BookController.all, {
  keyName: 'bige-api-key', // only connected user
  scopes: ['user', 'admin'], // scoped user or admin
  operator: 'oneOf' // operator oneOf user or admmin scope
}));
router.get('/book/:id', bigeMiddleware(BookController.getId, {
  keyName: 'bige-apim-key' // Only from authorized apps or APIs
}));
// Duplicate Middleware example to check app access and user logged access
router.get('/book/search',
  bigeMiddleware(
    bigeMiddleware(
      BookController.search,
      {
        keyName: 'bige-public-key' // Only check uniq apikey request authorization from APIM
      }
    ),
    {
      keyName: 'bige-api-key' // check user logged
    }
  ));

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
