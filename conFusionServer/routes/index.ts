import express, { Router } from 'express'

export const indexRouter = Router()

/* GET home page. */
indexRouter.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.render('index', { title: 'Express' })
});
