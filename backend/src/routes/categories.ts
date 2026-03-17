import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = Router();

router.use(authenticate);

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;
