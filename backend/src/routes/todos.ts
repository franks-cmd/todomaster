import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  reorderTodos,
} from '../controllers/todoController';

const router = Router();

router.use(authenticate);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/reorder', reorderTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.patch('/:id/toggle', toggleTodo);

export default router;
