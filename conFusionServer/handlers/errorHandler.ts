import { Response } from 'express'
import { httpResponseHandler } from './'

export const errorHandler = (error: any, res: Response) => {
    console.log(error)
    httpResponseHandler(res, 500, 'Internal Server Error')
}