import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 as uuidv4 } from 'uuid'
import { faker } from '@faker-js/faker'

@Entity()
export class CategoryTypeModel {
  @PrimaryKey()
  id: string = uuidv4()
  @Property({ unique: true })
  slug: string = faker.lorem.slug()
  @Property()
  name!: string
  @Property()
  description?: string
  @Property()
  createDate: Date = new Date()
  @Property()
  active!: boolean
}