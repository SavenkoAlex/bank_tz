import express from 'express'
import path from 'path'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { MikroORM } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { DatabaseSeeder } from './db/seeders/CategoryTypeSeeders'

const server = express()

void MikroORM.init <PostgreSqlDriver> ({
  metadataProvider: TsMorphMetadataProvider,
  entitiesTs: [path.resolve(process.cwd(), 'src/db/entities')],
  entities: [path.resolve(process.cwd(), 'dist/db/entities')],
  dbName: 'bank_tz',
  user: 'postgres',
  password: 'password',
  host: 'db',
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
.then( orm => {
  console.log('successfully connected to database')
  return orm
})
.then( async orm => {
  /*
  const migrator = orm.getMigrator()
  await migrator.createMigration(path.resolve(__dirname, 'db-migrations'), false)
  await migrator.down()
  await migrator.up()

  const generator = orm.getEntityGenerator();
  const dump = await generator.generate({ 
    save: true,
    baseDir: process.cwd() + '/my-entities',
  });
  console.log(dump);
  */
  const seeder = orm.getSeeder()
  await orm.getSchemaGenerator().refreshDatabase()
  await seeder.seed(DatabaseSeeder)
  await orm.close(true);
})
.then(() => {
  server.listen(8181, () => {
    console.log('Listen on 8181')
  })
}).catch(err => {
  console.error(err)
})

