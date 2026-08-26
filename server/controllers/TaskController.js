import {
  deleteTaskById,
  insertTask,
  selectAllTasks,
} from '../models/Task.js'
import { ApiError } from '../helper/ApiError.js'

const getTasks = async (_req, res, next) => {
  try {
    const result = await selectAllTasks()
    return res.status(200).json(result.rows || [])
  } catch (error) {
    return next(error)
  }
}

const createTask = async (req, res, next) => {
  try {
    const description =
      req.body.task?.description?.trim()

    if (!description) {
      return next(
        new ApiError(
          'Task description is required',
          400,
        ),
      )
    }

    const result = await insertTask(description)
    return res.status(201).json(result.rows[0])
  } catch (error) {
    return next(error)
  }
}

const deleteTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return next(
        new ApiError('Invalid task id', 400),
      )
    }

    const result = await deleteTaskById(id)

    if (result.rowCount === 0) {
      return next(
        new ApiError('Task not found', 404),
      )
    }

    return res.status(200).json({
      id: result.rows[0].id,
    })
  } catch (error) {
    return next(error)
  }
}

export {
  getTasks,
  createTask,
  deleteTask,
}
