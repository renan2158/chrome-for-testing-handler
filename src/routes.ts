import express from 'express'

import ChromeBrowserController from './controllers/ChromeBrowserController'

const routes = express.Router()

routes.get('/chrome/store', ChromeBrowserController.store)

export default routes
