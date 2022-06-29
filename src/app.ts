import express from 'express'
import path from 'path'
import { EntityRepository, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { MikroORM, RequestContext, EntityManager } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { DatabaseSeeder } from './db/seeders/CategoryTypeSeeders'
import { router } from './router'
import { CategoryTypeModel } from './db/entities/CategoryTypeModel'
import bodyParser from 'body-parser'

const server = express()

export const DI = {} as {
  server: typeof server
  orm: MikroORM,
  em: EntityManager,
  categoryRepository: EntityRepository<CategoryTypeModel>,
}

void MikroORM.init <PostgreSqlDriver> ({
  metadataProvider: TsMorphMetadataProvider,
  entitiesTs: [path.resolve(process.cwd(), 'src/db/entities')],
  entities: [path.resolve(process.cwd(), 'dist/db/entities')],
  dbName: 'bank_tz',
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  type: 'postgresql',
  discovery: {
    warnWhenNoEntities: false
  },
  seeder: {
    path: path.resolve(process.cwd(), 'dist/db/seeders'),
    pathTs: undefined,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  }
})
.then( async orm => {
  DI.orm = orm
  DI.em = orm.em
  DI.server = server
  DI.categoryRepository = DI.orm.em.getRepository(CategoryTypeModel)
  
  const seeder = orm.getSeeder()
  await orm.getSchemaGenerator().refreshDatabase()
  await seeder.seed(DatabaseSeeder)
})
.catch(err => {
  console.error(err)
  process.exit(2)
})


server.use((req, res, next) => RequestContext.create(DI.orm.em, next))
server.use(bodyParser.json())
server.use('/api', router)

server.listen(8181, 'localhost', () => {
  console.info('server started on 8181')
})


