import express from 'express'

import BrowserController from './controllers/BrowserController'

const routes = express.Router()

routes.get('/chrome/store', BrowserController.store)

export default routes
