import { Response } from 'express'

export const errorHandler = (error: any, res: Response) => {
    console.log(error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Internal Server Error')
}