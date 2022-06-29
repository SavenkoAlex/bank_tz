import { EntityData } from '@mikro-orm/core'
import { Factory, Faker } from '@mikro-orm/seeder'
import { CategoryTypeModel } from './CategoryTypeModel'
import { v4 as uuidv4 } from 'uuid'

export class CategoryTypeFactory extends Factory <CategoryTypeModel> {
  model = CategoryTypeModel

  protected definition(faker: Faker): EntityData<CategoryTypeModel> {
    return {
      id: uuidv4({}),
      slug: faker.lorem.slug(),
      name: faker.lorem.word(),
      description: faker.lorem.words(3),
      createDate: new Date(),
      active: faker.datatype.boolean()
    }
  }
}