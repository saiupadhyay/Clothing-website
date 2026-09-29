import express from 'express';
import {
  getLookbookPosts,
  createLookbookPost,
  updateLookbookPost,
  deleteLookbookPost
} from '../controllers/lookbookController.js';

const router = express.Router();

router.route('/')
  .get(getLookbookPosts)
  .post(createLookbookPost);

router.route('/:id')
  .put(updateLookbookPost)
  .delete(deleteLookbookPost);

export default router;
