import { Response } from 'express'

export const httpResponseHandler = (res: Response, status: number, message: string, data?: object) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    if (status === 401) {
        res.setHeader('WWW-Authenticate', 'Basic')
    }
    res.json({
        status,
        message,
        data
    })
}