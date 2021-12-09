import { Response } from 'express'

export const notFoundHandler = (dishId: string, res: Response) => {
    res.statusCode = 404
    res.end(`Dish ${dishId} not found!`)
}