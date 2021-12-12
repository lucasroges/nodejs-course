import { Response, NextFunction } from 'express'

export const unauthorizedHandler = (res: Response) => {
    const err = 'Unauthorized user!'
    res.setHeader('WWW-Authenticate', 'Basic')
    res.statusCode = 401
    res.end(err)
}