import express, { Router } from 'express'

export const users = Router()

/* GET users listing. */
users.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send('respond with a resource')
});
