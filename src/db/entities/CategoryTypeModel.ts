import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity()
export class CategoryTypeModel {
  @PrimaryKey()
  id!: string
  @Property({ unique: true })
  slug!: string
  @Property()
  name!: string
  @Property()
  description?: string
  @Property()
  createDate: Date = new Date()
  @Property()
  active!: boolean
}