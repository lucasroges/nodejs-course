import { Response } from 'express'

export const validationErrorHandler = (error: any, res: Response) => {
    console.log(error)
    const message = 'Bad request: validation error'
    const response = {
        message
    }
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.json(response)
}