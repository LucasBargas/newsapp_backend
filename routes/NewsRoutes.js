import express from 'express';
import NewsController from '../controllers/NewsController';
import CheckToken from '../middlewares/CheckToken';

const router = express.Router();

router.post('/', CheckToken.handleCheckToken, NewsController.newsCreate);
router.get('/user', CheckToken.handleCheckToken, NewsController.newsByUser);
router.get('/', NewsController.allNews);
router.get('/search', NewsController.newsSearch);
router.get('/:id', NewsController.newsLike);
router.get('/unique/:id', NewsController.newsById);
router.patch(
  '/:id',
  CheckToken.handleCheckToken,
  NewsController.newsUpdateById,
);
router.delete(
  '/:id',
  CheckToken.handleCheckToken,
  NewsController.newsDeleteById,
);

export default router;
