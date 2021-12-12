import { Response } from 'express'

export const notFoundHandler = (element: string, elementId: string, res: Response) => {
    res.statusCode = 404
    res.end(`${element} ${elementId} not found!`)
}