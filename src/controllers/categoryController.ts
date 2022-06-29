import { wrap, QueryOrder } from '@mikro-orm/core'
import {Request, Response } from 'express'
import { DI } from '../app'
import { CategoryTypeModel } from '../db/entities/CategoryTypeModel'


type QParams = {
  id: string | null,
  slug: string | null,
  name: string | null,
  description: string | null,
  active: string | null,
  search: string | null,
  pageSize: number,
  page: number,
  sort: string  | null
}

const getCategory = async (req: Request <QParams>, res: Response) => {
  if (Object.keys(req.query).length < 1) {
    res.sendStatus(400).json({message: 'parameters required'})
  }
  const { 
    id = null, 
    slug = null,
    name = null,
    description = null,
    active = null,
    search = null,
    pageSize = 2,
    page = 0,
    sort = null
  } = req.query
  
  let result = null
  
  if (id) {
    result = await DI.categoryRepository.findOne({ id: id as string })
    res.json(result)
    return
  } else if (slug) {
    result = await DI.categoryRepository.findOne({ slug: slug as string })
    res.json(result)
    return
  }
  
  let where = {}

  if (name && !search) {
    where = {...where, ...{ 
      name: {
        $ilile: replaceIfIncludes(name as string)
      }
    }}
  }

  if (description && !search) {
    where = {...where, ...{
      description: {
        $ilike: replaceIfIncludes(description as string)
      }
    }}
  }

  if (search) {
    where = {
      ...where,
      ...{
        $or: [
          {
            name: {
              $ilike: replaceIfIncludes(search as string)
            }
          },
          {
            description: {
              $ilike: replaceIfIncludes(search as string)
            }
          }
        ]
      }
    }
  }

  if (active) {
    where = {
      ...where,
      ...{
        active: {
          $eq: !(active === '0' || active === 'false')
        },
      }
    }
  }

  let limit = Number.parseInt(pageSize as string, 10)
  if (limit > 9 || limit < 1) {
    limit = 2
  }
  const offset = Number.parseInt(page as string, 10) * limit
  const orderBy = makeSortProperty(sort as string)
  result = await DI.em.find(CategoryTypeModel, where, {limit, offset, orderBy})

  res.json(result)
}

const createCategory = async (req: Request <CategoryTypeModel>, res: Response) => {
  const { body: category } = req
  if (category) {
    const result = await DI.categoryRepository.create(category)
    await DI.categoryRepository.flush()
    res.json(result)
    return
  }

  res.sendStatus(400).json({message: 'data model was not provided'})
}

const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) {
    res.sendStatus(400).json({message: 'id is required'})
    return
  }
  const category = await DI.categoryRepository.findOne({id})
  if (!category) {
    res.sendStatus(400).json({message: 'entity not found'})
    return
  }

  wrap(category).assign(req.body)
  await DI.categoryRepository.flush()
  res.json(category)
}

const deleteCategory = async (req: Request <{ id: string }>, res: Response) => {
  const { id } = req.params
  await DI.categoryRepository.nativeDelete({id})
  res.sendStatus(200)
}

const getCategories  = async (req: Request <CategoryTypeModel>, res: Response) => {
  const {
    name,
    description
  } = req.query
  const result = await DI.em.find(CategoryTypeModel, {
    name: { $ilike: `${name}` },
    description: { $ilike: `${description}` }
  })
  res.json(result)
}




function replaceIfIncludes(string: string): string  {
  if (string.includes('е')) {
    const replaced = string.replace('е', '(е|ё)')
    return `%${replaced}%`
  }
  return `%${string}%`
}

function makeSortProperty(param: string): {[key: string]: QueryOrder.ASC | QueryOrder.DESC} | undefined {
  let property = null
  let order: 'ASC' | 'DESC' = 'ASC'

  if (!param.length) {
    return
  } 

  if (param.startsWith('-')) {
    property = param.slice(1)
    order = 'DESC'
  } else {
    property = param
  }

  return {
    [`${property}`]: QueryOrder[order]
  }
}

export {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories
}