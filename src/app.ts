import express from 'express'


const server = express()


server.listen(8181, () => {
  console.log('Listen on 8181')
})
