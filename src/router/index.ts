import { Router } from 'express'
import { categoryRouter } from './routes/categoryRouter'

const router = Router()

router.use('/category', categoryRouter)

export {
  router
}