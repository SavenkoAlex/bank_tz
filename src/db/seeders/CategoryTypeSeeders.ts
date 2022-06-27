import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { CategoryTypeFactory } from '../entities/CategoryTypeFactory'

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
      new CategoryTypeFactory(em).make(10);
  }
}