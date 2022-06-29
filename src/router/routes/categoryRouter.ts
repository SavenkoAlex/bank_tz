import { Router as router} from 'express'
import {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../controllers/categoryController'

const categoryRouter = router()

categoryRouter.get('/', getCategory)
categoryRouter.post('/', createCategory)
categoryRouter.put('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)

export { categoryRouter }
