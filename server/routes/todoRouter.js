import { Router } from 'express'
import { auth } from '../helper/auth.js'
import {
  createTask,
  deleteTask,
  getTasks,
} from '../controllers/TaskController.js'

const router = Router()

router.get('/', getTasks)
router.post('/', auth, createTask)
router.delete('/:id', auth, deleteTask)

export default router
