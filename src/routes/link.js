import { Router } from 'express';
import { wrap } from '../utils';
import { validateRequest } from '../middlewares';
import { LinkController } from '../controllers';
import { CreateLinkRequest, UuidPathParam } from '../requests';

const linkRouter = Router();

linkRouter.post(
  '/',
  validateRequest(CreateLinkRequest),
  wrap(async (req, res) => {
    const result = await LinkController.createLink(req.body);
    res.json(result);
  }),
);

linkRouter.get(
  '/:id',
  validateRequest(null, { params: UuidPathParam }),
  wrap(async (req, res) => {
    const link = await LinkController.getLinkById(req.params.id);
    res.json(link);
  }),
);

export { linkRouter };
